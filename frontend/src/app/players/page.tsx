// app/players/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WithAuth from "@/components/WithAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Players() {
  const [players, setPlayers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/players", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("获取玩家失败");
        return res.json();
      })
      .then((data) => {
        setPlayers(data);
      })
      .catch((err) => alert(err.message));
  }, []);

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/api/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (res.ok) {
      const refreshed = await fetch("http://localhost:8080/api/players", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedPlayers = await refreshed.json();
      setPlayers(updatedPlayers);
      setName("");
    } else {
      alert(data.error || "添加玩家失败");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center px-4 py-10">
      <Card className="w-full max-w-xl shadow-md">
        <CardContent className="py-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">玩家列表</h1>

          {players && players.length > 0 ? (
            <ul className="space-y-2">
              {players.map((player) => (
                <li
                  key={player.id}
                  className="bg-muted px-4 py-2 rounded-md text-foreground hover:bg-green-100 dark:hover:bg-green-800 transition-colors duration-200 "
                >
                  {player.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              您还没有任何 player，请先添加 player。
            </p>
          )}

          <form
            onSubmit={handleAddPlayer}
            className="flex flex-col md:flex-row gap-3 items-center"
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="新玩家名称"
              className="flex-1"
              required
            />
            <Button type="submit" className="w-full md:w-auto">
              添加玩家
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="text-sm text-destructive hover:underline"
            >
              退出登录
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default WithAuth(Players);
