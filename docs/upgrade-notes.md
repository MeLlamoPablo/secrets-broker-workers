# 升级说明：审计导出与审计查询的四处破坏性变更

适用版本：审计服务端过滤 + 条件导出上线的那一次部署。
影响对象：**不经过控制台**、直接调用 `/api/audit` 的脚本、cron、CI、下载器。

四处变更都会立刻影响调用方，前两处最容易"静默出错"而不是报错，请先扫一遍。

---

## 1. 导出：`GET /api/audit?format=csv` → `POST /api/audit`

**旧写法**（直接下载，无二次验证）

```powershell
Invoke-WebRequest -Uri "https://sb.example.com/api/audit?format=csv" `
  -Headers @{ Cookie = "__Host-broker_admin=<SESSION>" } -OutFile audit.csv
```

**现在的行为**：GET 返回 **428**，响应体是机器可读的：

```json
{
  "error": "confirmation_required",
  "code": "audit_export_post_only",
  "message": "审计导出已改为 POST + 二次验证：GET 不再返回 CSV。…",
  "next_step": "POST /api/audit with {\"format\":\"csv\",\"confirmPassword\":\"<password or TOTP>\"}",
  "docs": "docs/upgrade-notes.md"
}
```

**新写法**

```powershell
Invoke-RestMethod -Method Post -Uri "https://sb.example.com/api/audit" `
  -Headers @{ Cookie = "__Host-broker_admin=<SESSION>" } `
  -ContentType 'application/json' `
  -Body '{"format":"csv","agent":"d1","from":"2026-10-01","to":"2026-11-04","confirmPassword":"<主密码或 TOTP>"}' `
  -OutFile "secrets-broker-audit-<range>-<stamp>.csv"
```

- `confirmPassword` 或 `confirmCode`（开了 TOTP 时）**必须给**，和"条目导出"同一套二次验证；不要以为"只是日志"就放宽。
- 筛选条件与 JSON 查询完全一致，导出就是"当前筛选"。

> 侧信道提醒：`next_step` 而不是 401，是为了让调用方能区分"要换方法"和"登录失效"。

## 2. JSON：`entries` 不再是全量，默认一页 200 条

**旧语义**：`GET /api/audit` 返回的 `entries` 是整个日志数组。
**新语义**：`entries` 是当前页；还有 `total`、`hasMore`、`firstPage`、`page`、`pageCount`、`offset`、`limit`。

```json
{
  "entries": [ ... ],
  "total": 1732,
  "offset": 0,
  "limit": 200,
  "hasMore": true,
  "firstPage": true,
  "page": 1,
  "pageCount": 9,
  "masked": false
}
```

响应头同时带 `x-audit-total` / `x-audit-has-more` / `x-audit-page-size` / `x-audit-offset`，不解析 body 的调用方也能判断"没取完"。

**旧写法 → 新写法**

```powershell
# 旧：一次拿全量，然后在本地过滤
$all = (Invoke-RestMethod ".../api/audit").entries | Where-Object { $_.agent -eq 'd1' }
```

```powershell
# 新：条件交给服务端，循环翻页
$offset = 0
$pages = @()
do {
  $r = Invoke-RestMethod ".../api/audit?agent=d1&limit=500&offset=$offset"
  $pages += $r.entries
  $offset += $r.limit
} while ($r.hasMore)
```

支持的过滤参数：`item`、`agent`、`event`（组名，如 `read`/`grant`/`risk`）、`q`（模糊匹配）、`from`、`to`（日期只写 `YYYY-MM-DD` 时上界含整日）、`limit`（≤500）、`offset`。

## 3. CSV 文件名带范围与时间戳

**旧**：`secrets-broker-audit.csv`
**新**：`secrets-broker-audit-<range>-<YYYYMMDD-HHmmss>.csv`，例如 `secrets-broker-audit-2026-10-01_2026-11-04-20261104-093012.csv`

按固定文件名轮询/覆盖的脚本需要改成取 `Content-Disposition` 或自行拼名。

## 4. 锁定态导出的首行是注释

未解锁时导出的条目名是脱敏的，文件第一行固定为：

```
# 因未解锁，条目名称已脱敏（本文件由锁定态控制台导出）
```

把 CSV 当"第一行必是表头"解析的脚本会错列。解析前跳过以 `#` 开头的行。

---

## 附：另外两个新增的机器可读字段（非破坏性）

- `request_access` 在 `outside_scope` / `not-in-scope` / `no-grant` 时返回 `next_step`（人话的补救动作）与 `docs`。只渲染 `code` 的第三方客户端也能据此提示管理员去「Agents → 权限矩阵」加入可申请范围。
- 控制台新增 `rotateReminderDays`（默认 180）与 `expiryBlocksReads`（默认 `false`）。后者只有显式打开才会让到期条目的 `secret.read` 被拒绝，默认只提醒、不改变任何授权判定。
