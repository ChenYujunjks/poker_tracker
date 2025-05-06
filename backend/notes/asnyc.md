非常聪明的问题！但这里其实**不是异步问题**，而是 **Go 初始化顺序的问题（程序启动时的执行顺序）**。

---

### ✅ 问题本质：**变量初始化优先于 `init()` 执行**

Go 的执行顺序是这样的：

```
1. import 语句执行，加载包
2. 然后初始化该包中的全局变量（`var`）
3. 最后才执行 `init()` 函数
```

---

### 🔥 举个精确的例子

你写了：

```go
// config/config.go
func init() {
    godotenv.Load() // 加载 .env
}

var DBUser = os.Getenv("DB_USER") // ❌ 但这行先于 init() 执行
```

执行顺序是：

```
1. var DBUser = os.Getenv("DB_USER")      ← ❌ 此时 .env 尚未加载
2. func init() { godotenv.Load() }         ← ✅ 但太晚了，DBUser 已经是 ""
```

所以你的 `DBUser`、`DBPassword` 这些变量永远都是空字符串，即使 `.env` 成功加载。

---

### ❌ 为什么不是异步问题？

- Go 的 `init()` 和变量初始化都是在**主线程中同步执行的**，并没有发生 goroutine 或异步行为。
- 你看到的“晚了”，是初始化顺序的问题，而不是并发、异步的问题。

---

### ✅ 正解：用函数封装 `os.Getenv` 才能确保正确读取

```go
func DBUser() string {
    return os.Getenv("DB_USER") // 运行时再读取
}
```

这样你调用 `config.DBUser()` 的时候，一定是在 `.env` 已加载之后，保证值是对的。

---

### 想更深入了解？

你可以加一段代码验证 Go 的执行顺序：

```go
var x = func() string {
    fmt.Println("Step 1: var x = ...")
    return os.Getenv("DB_USER")
}()

func init() {
    fmt.Println("Step 2: init() runs")
    godotenv.Load()
}
```

运行结果一定是：

```
Step 1: var x = ...
Step 2: init() runs
```

这就印证了：变量初始化**先于**`init()` 执行！
