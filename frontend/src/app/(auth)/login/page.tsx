"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
      alert(data.error || "登录失败 / Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardContent className="pt-6 space-y-4">
          <h1 className="text-2xl font-semibold text-center">
            登录账号 / Sign In
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名 / Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名 / Enter your username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码 / Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码 / Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              登录 / Log In
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            还没有账号？ / Don’t have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              去注册 / Register
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
