"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      router.push("/players");
    } else {
      alert(data.error || "登录失败");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6">登录账号</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm bg-gray-900 p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="用户名"
          required
          className="px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
          required
          className="px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          登录
        </button>
      </form>
      <p className="mt-4 text-gray-400 text-sm">
        还没有账号？{" "}
        <a href="/register" className="text-blue-400 hover:underline">
          去注册
        </a>
      </p>
    </div>
  );
}
