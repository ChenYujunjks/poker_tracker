### 架构取舍：MVP（Next .js + Go + MySQL）⇢ 正式上线（Next .js + Supabase）

| 关注点        | MVP（本地）                 | 正式上线（Supabase）                                                                     | 思考要点                                                                                                                        |
| ------------- | --------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **后端**      | Go + Gin/GORM，全部自行维护 | Supabase 提供 Postgres、Auth、Edge Functions、Storage                                    | Supabase 减少运维，但丧失对底层 DB 的完全掌控；Edge Functions 可用 Deno/TypeScript，若你想继续用 Go，需要单独部署 micro-service |
| **数据库**    | MySQL，本地或自管云实例     | Postgres（可直接 SQL、也可用 Data API）                                                  | 迁移脚本要提前设计（SQL 兼容性、时间/JSON 类型差异）                                                                            |
| **业务逻辑**  | 写在 Go 服务里              | · 轻量逻辑 → Supabase RLS / Edge Functions<br>· 重逻辑 → 仍可保留独立 Go 服务接 Supabase | 越多逻辑下沉到 Supabase，Go 服务越薄                                                                                            |
| **安全**      | JWT + 中间件                | Supabase 自带 JWT、RLS，你只负责前端存 token                                             | API Key 仅放在`.env`里，通过 Vercel/Cloudflare Secrets 注入                                                                     |
| **成本/扩展** | 仅服务器成本                | 免费额度 + 纵向扩展托管                                                                  | 读写峰值、函数冷启动延迟需压测                                                                                                  |

> **结论**
>
> - **可行**：MVP 用 Go/MySQL 快速迭代，验证数据模型；正式版交给 Supabase 减轻运维。
> - **风险控制**：保持业务层抽象，避免深度耦合 MySQL 专有语法；必要时写一层 Data Access Layer，让你可以在 MySQL/Postgres 之间切换。

---

### GitHub 组织方式

| 方案                                                             | 适用场景             | 优点                                            | 缺点                       |                           |
| ---------------------------------------------------------------- | -------------------- | ----------------------------------------------- | -------------------------- | ------------------------- |
|                                                                  |                      |
| **独立仓库 x 2**<br>`mvp-next-go`                                | `prod-next-supabase` | 两套代码 > 80 % 不同；你想开源 MVP 但私有生产版 | 历史清晰；每个 repo 依赖轻 | 跨仓库共享代码/流水线麻烦 |
| **单仓核心库 + 多仓壳**<br>`core-lib`(domain/types)<br>`mvp-app` | `prod-app`           | 业务模型 & 通用组件需要强一致                   | 既分离又可共享             | 维护三个 repo，配置略繁琐 |

> **对你现在的情况推荐**：
>
> 1. **Monorepo** 足够；用 turbo / nx 或 just script 把前端、Go API 分成独立 package，以后如果完全弃用 Go API 也能直接在同仓 PR 删除目录。
> 2. 在 `/packages/common` 放数据库 schema（Prisma schema 或 SQL migration）、TS 类型，前后端共享。
> 3. CI 矩阵：`web-*` 用 pnpm —filter，`api-*` 用 Go workflow；若未来删 Go，仅删一段 YAML。

---

### 关于 tRPC 的再确认

- **Go API ↔ Next MVP**：你已经有 REST 接口，tRPC 用处不大。
- **Next ↔ Supabase**：客户端 SDK（`@supabase/supabase-js`）已解决类型安全，通常不需要额外 tRPC。如果你仍想保持「前端只调自定义 API」的模式，可在 Next Server Actions/Edge Functions 包一层，但那只是为了隐藏 Supabase Key，并非真正 tRPC 的场景。
