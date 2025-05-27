# 🃏 Poker Tracker API 文档（Go + Gin）

> 所有受保护接口均需在 Header 中加入：
>
> ```http
> Authorization: Bearer <JWT Token>
> ```

---

## 🧑‍💼 用户认证

### ✅ POST `/api/register`

注册账号并自动登录

#### 请求体：

```json
{
  "username": "yitan",
  "password": "abc123"
}
```

#### 返回：

```json
{
  "token": "<JWT Token>"
}
```

---

### ✅ POST `/api/login`

用户登录，返回 JWT

#### 请求体：

```json
{
  "username": "yitan",
  "password": "abc123"
}
```

#### 返回：

```json
{
  "token": "<JWT Token>"
}
```

---

## 🧑‍🎓 玩家管理（Player）

### ✅ GET `/api/players`

返回当前用户的所有玩家（已按 user_id 过滤）

#### 返回：

```json
[
  { "id": 1, "name": "Yitan" },
  { "id": 2, "name": "Alice" }
]
```

---

### ✅ POST `/api/players`

新增玩家

#### 请求体：

```json
{ "name": "Tom" }
```

#### 返回：

```json
{ "id": 3, "name": "Tom" }
```

---

### ✅ PUT `/api/players/:id`

更新玩家名称（需归属当前用户）

#### 请求体：

```json
{ "name": "New Name" }
```

---

### ✅ DELETE `/api/players/:id`

删除玩家（需归属当前用户）

---

## 🗓 Session 管理

### ✅ GET `/api/sessions`

获取当前用户所有 Session（用于生成日历点）

#### 返回：

```json
[
  { "id": 1, "date": "2025-04-21" },
  { "id": 2, "date": "2025-04-23" }
]
```

---

### ✅ GET `/api/sessions/:date`

获取指定日期的所有 Session

例如：`/api/sessions/2025-04-23`

---

### ✅ POST `/api/sessions`

创建 Session（日期格式需为 YYYY-MM-DD）

#### 请求体：

```json
{ "date": "2025-04-23" }
```

#### 返回：

```json
{ "id": 5, "date": "2025-04-23" }
```

---

## 🎮 GameRecord 游戏记录

### ✅ POST `/api/gamerecords`

创建一条记录（同一 session + player + user 不能重复）

#### 请求体：

```json
{
  "session_id": 1,
  "player_id": 2,
  "buy_in": 300.0,
  "cash_out": 500.0, // 可选
  "paid": true // 可选
}
```

#### 返回：

```json
{
  "id": 12,
  "session_id": 1,
  "player_id": 2,
  "buy_in": 300,
  "cash_out": 500,
  "paid": true
}
```

---

### ✅ GET `/api/gamerecords?session_id=1`

获取某场 Session 的所有记录（仅当前用户）

---

### ✅ PUT `/api/gamerecords/:id`

更新一条记录，支持局部更新：

#### 请求体：

```json
{
  "buy_in": 350,
  "cash_out": 520,
  "paid": false
}
```

---

### ✅ DELETE `/api/gamerecords/:id`

删除记录（必须为当前用户创建）

#### 返回：

```json
{ "message": "记录删除成功" }
```

---

## 📌 错误响应示例（统一格式）

```json
{ "error": "请求数据格式错误" }
{ "error": "未登录" }
{ "error": "无效的 player_id 或无权限" }
{ "error": "该记录已存在，不能重复添加" }
```

---

## 🔒 认证要求

- 除了 `/login` 和 `/register` 以外，所有路由都必须携带 `Authorization: Bearer <token>`
- Token 为标准 JWT，后端会解析 `user_id` 注入上下文

---

✅ 文档完成！如需导出 Postman Collection 或补充分析路由（盈亏统计），请继续说明。
