## 开发、构建与部署

- **本地开发**

  - 在 `backend` 目录下启动 Go 服务，监听 API 请求。
  - 在 `frontend` 目录下启动 Next.js 开发服务器，并配置好 API Base URL。

- **构建与部署**

  - 设计 Dockerfile 分别为前后端创建镜像
  - 利用 CI/CD（例如 GitHub Actions、Jenkins）实现自动化构建、测试和部署
  - 部署时确保数据库迁移脚本能够在新环境中正确运行

- **数据库设计**：使用三个表（Session、Player、GameRecord）建立基本数据模型和关联，满足所有业务统计和对账的需求。
- **后端架构**：用 Go 搭建 API 服务，分层处理数据库连接、数据模型、业务逻辑和路由。
- **前端架构**：使用 Next.js 构建用户页面，提供录入、查询和展示接口，与后端 API 对接。
- **代码管理**：用 Git 进行版本控制，按模块划分目录，确保结构清晰、便于扩展与维护。

---

## ✅ 简单概括：Session Auth 和 JWT Auth 的核心区别

| 项目                 | Session Auth（传统）           | JWT Auth（现代）                           |
| -------------------- | ------------------------------ | ------------------------------------------ |
| **身份信息存储位置** | 服务端（通常是内存或 Redis）   | 客户端（Token 保存在 LocalStorage/Cookie） |
| **是否有状态**       | 有状态（需要在服务端维护会话） | 无状态（服务端不保存用户状态）             |
| **扩展性（分布式）** | 一般需要共享 session store     | 无需共享状态，更适合微服务、CDN 等场景     |
| **安全性**           | 高（session 不泄露即可）       | 中等（Token 泄露后不可撤销，需刷新机制）   |
| **跨域支持**         | 较复杂（涉及跨域 Cookie）      | 更简单（适合前后端分离）                   |
| **客户端持久性**     | 通常依赖 cookie 的有效期       | 可以灵活控制 token 有效期和刷新逻辑        |

---

## ✅ 使用场景对比

### 🔒 Session 认证（适合服务端渲染，传统架构）

- 比如：后台管理系统，全部页面都在服务端渲染，用户登录后在 cookie 中种下 session ID，服务器维护 session map。
- 用法示意：
  ```go
  session := sessions.Default(c)
  session.Set("user_id", user.ID)
  session.Save()
  ```

### 🔑 JWT 认证（适合前后端分离）

- 比如：React、Vue、Next.js 等前端调用后端 API，后端只返回 token，不保存任何状态。
- 用法示意：
  ```ts
  localStorage.setItem("token", "xxx.yyy.zzz");
  fetch("/api/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  ```

---

## ✅ 为什么现在更推荐 JWT？

| 理由                                 | 说明                                      |
| ------------------------------------ | ----------------------------------------- |
| ✅ 无状态                            | 服务端不需要维护会话，更适合高并发系统    |
| ✅ 更适合前后端分离                  | Token 放在 header 里，天然跨域友好        |
| ✅ 容易集成身份验证服务（如 OAuth2） | 很多第三方登录都基于 JWT                  |
| ✅ 更灵活的权限设计                  | 可以把角色、权限、过期时间等编码进 JWT 里 |

---

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
