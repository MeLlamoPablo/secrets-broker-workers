# Vault 2.0 按账户迁移：操作与回滚清单

本文对应 `migrations/0003_v2_account_keys.sql` 与 `POST /api/v2/migrate`（实现见
`src/vault2.js` 的 `vault2MigrateAccount`）。D1 的日常盘点、配额与导出背景见
[`d1-recovery-2026-10-29.md`](./d1-recovery-2026-10-29.md)，两份文档一起看。

## 结论（先读这三条）

1. **迁移前必须做 `wrangler d1 export`**。Worker 服务请求时无法对 D1 取一致快照，
   迁移会把旧行重封到账户密钥并改写 `account_id`，出问题时只能靠导出还原。
2. **迁移后不能只回滚代码**。旧代码只认 `password` keyring，迁移后的行由
   `account:<email>` keyring 封装、并带上了 `account_id`，旧代码解不开它们，
   看起来就像“条目全丢了”。回滚必须“恢复 D1 导出 + 回滚代码”一起做。
3. **没有 `account_id` 的旧行由第一个执行迁移的账户认领**（`legacyClaim: 'first-account'`）。
   迁移之后无法反推它们原本属于谁；多账户部署如果先切换账户再迁移，后一个账户不会继承这些行。

## 操作清单

按顺序执行，前一步确认成功再进入下一步。

### 1. 冻结写入（软冻结）

软冻结即可：让所有写入方停止写，不需要动设备状态。

- 通知所有使用方暂停写入：桌面端 / CLI / 浏览器扩展的同步，以及面板上的新建、编辑、删除。
- 等同步队列清空后，用 revision 确认没有新写入进来（下面记录一次，第 7 步再对一次）。
- 只有软冻结做不到时（例如无法联系到某台设备、或有客户端持续重试），才升级为强制手段：
  `DELETE /api/v2/devices/<id>` 撤销设备。**注意：撤销会作废该设备的 token**，之后需要重新配对，
  不是可逆的“暂停”。
- 记录当前 revision，便于迁移后核对：

  ```powershell
  npx wrangler d1 execute secrets-broker-v2 --remote --command "SELECT value FROM meta WHERE key='revision'"
  ```

- 确认没有残留的迁移标记（正常情况下迁移结束会清掉；有残留说明上次异常退出，先按第 6 步重跑收敛）：

  ```powershell
  npx wrangler d1 execute secrets-broker-v2 --remote --command "SELECT key FROM meta WHERE key LIKE 'migrate:%'"
  ```

### 2. 导出 D1（一致性备份）

```powershell
New-Item -ItemType Directory -Force .\backup | Out-Null
npx wrangler d1 export secrets-broker-v2 --remote --output .\backup\secrets-broker-v2-pre-migrate.sql
```

- 确认 `backup/` 在 `.gitignore` 里，导出文件绝不提交。
- 记录文件大小与导出时间；迁移失败时这是唯一的还原点。

### 3. 应用 schema 迁移

```powershell
npx wrangler d1 migrations apply secrets-broker-v2 --remote
```

- 只增加列与索引（`account_id`、`idx_*_account`），不改数据，可重复安全。
- 这一步之后，旧代码仍能正常读写：新列为 `NULL` 就是 legacy 行。

### 4. 部署新 Worker

```powershell
npx wrangler deploy
```

- 部署后用只读接口确认基本面：

  ```powershell
  npx wrangler d1 execute secrets-broker-v2 --remote --command "SELECT COUNT(*) AS items FROM vault_items WHERE account_id IS NULL"
  ```

### 5. 登录并解锁

- 用管理员账号登录面板，确认 `GET /api/v2/status` 返回 `initialized: true`。
- `POST /api/v2/unlock`（面板上的“解锁”）输入主密码，拿到账户密钥。
  未迁移时这里会回落 legacy 密钥，属正常现象。
- 解锁必须在**当前要认领旧行的账户**下进行；`account` 取 `settings.vaultEmail`，
  为空时回落 `VAULT_EMAIL`。

### 6. 执行迁移

```powershell
curl.exe -X POST https://<host>/api/v2/migrate ^
  -H "content-type: application/json" ^
  -b "<管理员会话 cookie>" ^
  -d '{"password":"<主密码>"}'
```

返回字段含义：

| 字段 | 含义 |
|---|---|
| `minted` | 是否新建了该账户的 keyring |
| `converted` | 旧密钥行重封到账户密钥的条数 |
| `tagged` | 已由账户密钥加密、仅补 `account_id` 的条数（中断后重跑） |
| `skipped` | 两把钥匙都打不开、留给别的账户的条数 |
| `claimed` | 本次认领的 `account_id IS NULL` 行数（`converted + tagged`） |
| `legacyClaim` | 固定为 `first-account`：旧行归本次执行迁移的账户 |
| `remaining` | 迁移后仍为 `account_id IS NULL` 的行数，**必须为 0** |

- 接口可重入：中断后重跑会收敛，不会重复加密。
- 迁移期间 `items` 路由返回 503（`migrate:<account>` 标记），属预期。

### 7. 校验

```powershell
npx wrangler d1 execute secrets-broker-v2 --remote --command "SELECT COUNT(*) AS left_null FROM vault_items WHERE account_id IS NULL"
npx wrangler d1 execute secrets-broker-v2 --remote --command "SELECT COUNT(*) AS unowned_devices FROM devices WHERE account_id IS NULL"
```

- `left_null` 必须为 0；不为 0 说明还有别的账户/别的 keyring 的行，看第 6 步的 `skipped`。
- `unowned_devices` 是 legacy 设备，属正常（见“设备规则”）。
- 面板逐项抽查几条条目能正常打开，再解除写入冻结。

## 回滚

### 允许的回滚方式

1. 冻结写入（同第 1 步）。
2. 恢复迁移前的 D1 导出到 `secrets-broker-v2`（先 `drop`/重建表或按导出内容覆盖，
   按 [`d1-recovery-2026-10-29.md`](./d1-recovery-2026-10-29.md) 的导出/恢复流程操作）。
3. 回滚 Worker 代码到迁移前的版本并部署。
4. 解锁并抽查：旧密钥应能打开全部条目。
5. 解冻写入。

### 不能做的事

- **只回滚代码、不回滚 D1**：迁移后的行由账户密钥封装，旧代码只加载 legacy keyring，
  会表现为“条目全部无法解密”。`account_id` 列本身留着无害，但行内容已经变了。
- **只恢复 D1、不回滚代码**：新代码遇到 `account_id IS NULL` 会按 legacy 密钥读，
  在单账户部署里通常还能读，但迁移标记与 keyring 状态可能不一致，不建议停留在这个组合。
- **把 `converted`/`tagged` 的条目手工改回 `account_id = NULL`**：不会自动恢复旧密文，
  只会制造“有主但无人能读”的行。

## 设备规则（迁移相关）

- `account_id` 为空的设备是迁移前配对的 legacy 设备：所有账户都能看到、能撤销、能改写入权限；
  列表里带 `legacy: true`，`account` 为 `null`。
- 归属其他账户的设备：列表不可见，撤销/改权限/清除一律按“找不到”处理（404），
  不暴露该 id 是否存在。
- 设备配对时写入当前账户；迁移后新设备不会再出现 `account_id` 为空的行。

## 交叉引用

- D1 配额、盘点与导出： [`d1-recovery-2026-10-29.md`](./d1-recovery-2026-10-29.md)
- schema：`migrations/0003_v2_account_keys.sql`
- 迁移实现：`src/vault2.js` → `vault2MigrateAccount`
- 接口：`src/index.js` → `POST /api/v2/migrate`
</content>
