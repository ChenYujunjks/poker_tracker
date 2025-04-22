"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("注册成功，请登录");
      router.push("/login"); // 跳转到登录页面
    } else {
      alert(data.error || "注册失败");
    }
  };

  return (
    <div>
      <h1>注册</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="用户名"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
          required
        />
        <button type="submit">注册</button>
      </form>
      <p>
        已有账号？<a href="/login">去登录</a>
      </p>
    </div>
  );
}
