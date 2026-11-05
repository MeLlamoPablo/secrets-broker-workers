# 版本号与发版

版本号只有一个来源：仓库根目录 `package.json` 的 `version`。

运行时代码读的是 `src/version.js` 里的 `NAME` / `VERSION` 常量，它由 `scripts/sync-version.mjs` 从 `package.json` 生成。之所以不直接 `import '../package.json'`：wrangler 打包时会内联 JSON，但 CI 的 Miniflare 套件不走打包（它直接按模块图加载 `src/index.js`），而 Miniflare 的模块规则只支持 `ESModule` / `CommonJS` / `CompiledWasm` / `Text` / `Data`，JSON 导入会以 `ERR_MODULE_RULE` 直接失败。所以运行时留一份生成副本，并由 `test:version` 校验它与 `package.json` 一致——**两个文件不会各写一个版本号，第二处永远是从第一处生成的**。

改了 `package.json` 的版本后跑一次：

```powershell
npm run sync:version
```

`npm version` 和 `npm run deploy` 都会自动调用它，正常发版不需要手动跑。忘了同步时 CI 的 `test:version` 会失败，不会把不一致的版本带上线。

## 当前版本

起步为 `0.5.0`。`0.x` 表示仍在迁移期：v1 → v2 的 vault 迁移、TOTP 与解锁合并都还没收口。等迁移跑完、线上稳定运行一段时间后再谈 `1.0.0`，在此之前出现破坏性变更只升 minor，不必为了语义化硬造 1.0。

## 什么时候升

| 改动 | 升 | 例子 |
| --- | --- | --- |
| 破坏性接口/行为变更（旧客户端会坏） | minor（`0.5.0` → `0.6.0`） | 删除旧 `/api/sync`、改解锁协议 |
| 新功能、新端点、新 UI | minor | `/api/version`、新的审批视图 |
| 修复、文案、性能、无行为变化的重构 | patch（`0.5.0` → `0.5.1`） | 审计可见性修复、轮询降频 |
| 只改文档/CI | 不必发版 | README、workflow 调整 |

一次发版对应一个 tag、一个 Release，tag 与 `package.json` 必须一致（下面的工作流会校验，不一致直接失败）。

## 发布一个版本

```powershell
npm version 0.6.0 --no-git-tag-version   # 只改 package.json + package-lock.json，不建 tag
npm run sync:version                     # 把 src/version.js 同步到 0.6.0
npm run test:version && npm run test:oidc && npm run test:r1-r6
git add package.json package-lock.json src/version.js
git commit -m "release: 0.6.0"
git push origin main
git tag v0.6.0
git push origin v0.6.0
```

打 tag 不会自动部署，也不会自动发布 Release——目前两者都要人确认（见下）。

## 部署时把 commit 带上

`/api/version` 的 `commit` / `deployedAt` / `workerVersion` 来自可选的 `version_metadata` 绑定：

```jsonc
// 本机 wrangler.jsonc（不入仓库）
"version_metadata": { "binding": "CF_VERSION_METADATA" }
```

`wrangler.example.jsonc` 里已有同样的模板。**没有这个绑定时代码不会坏**，三个字段回答 `"unknown"`，端点依旧 200。

部署时用 `--tag` 记录 commit，否则 `commit` 会是 `unknown`：

```powershell
npx wrangler deploy --tag "$(git rev-parse HEAD)"
```

`--tag` 的值会原样出现在 `version_metadata.tag`，所以这里用完整 commit SHA 而不是版本号：版本号已经能从 `package.json` 读到，tag 用来回答“线上跑的是哪个 commit”。

## 线上自查

```powershell
Invoke-RestMethod https://sb.otscup.com/api/version
```

```json
{
  "name": "secrets-broker-workers",
  "version": "0.5.0",
  "commit": "4edd28e95e47b8dda0dae3ebbd8b1aea1b33000f",
  "deployedAt": "2026-11-05T12:34:56Z",
  "workerVersion": "ab475c11-b8f6-4a5d-a35b-bcd0b6c609b1"
}
```

对照方式：

1. `version` → 仓库 `package.json`，说明是哪个版本；
2. `commit` → `git show <commit>` 或 `gh release view v<version>`，说明是哪个提交；
3. `deployedAt` → 部署时间；
4. `workerVersion` → `npx wrangler deployments list` 里的 Version ID，说明线上此刻 100% 流量落在哪个版本。

四个都对上，才算“这个版本对应这个 commit 上线了”。任何一个是 `unknown`，就是绑定位或 `--tag` 没带。

## GitHub Release

仓库里有 `.github/workflows/release.yml`，**只支持手动触发**（`workflow_dispatch`），不监听 tag push，避免一次误推 tag 就产生公开 Release。步骤：

1. GitHub → Actions → `release` → Run workflow；
2. 输入已存在的 tag，如 `v0.5.0`；
3. 工作流校验 `tag` 与 `package.json` 版本一致后，用 `gh release create --generate-notes` 生成 Release，正文由 GitHub 自动列出上一个 tag 以来的 commit。

只用了 `GITHUB_TOKEN`，零成本、无付费依赖、不需要往仓库放凭据。

手工等价命令（工作流不可用时）：

```powershell
gh release create v0.5.0 --generate-notes --title v0.5.0 --verify-tag
```

`--verify-tag` 要求 tag 已经推到远端；`--generate-notes` 的 commit 范围以上一个 Release 为准。

## 桌面端、扩展不跟这个号

- `desktop/src-tauri/tauri.conf.json` + `Cargo.toml` 是 `0.2.24`，由 `desktop-release` 工作流用 `desktop-v*` tag 发布，有独立节奏（安装包、签名、更新检查都绑在它上面）。MSI 和 Worker 不是一次构建，强行同号只会让两个发布流程互相卡住。
- `extension/manifest.json` 是 `0.1.0`，浏览器扩展商店的版本约束独立。
- `dsh-plugin/package.json` 是 `0.1.0`，插件市场独立。

它们各自维护自己的版本，本文件只约束 Worker 与 CLI。
