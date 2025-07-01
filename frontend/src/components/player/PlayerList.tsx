"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAllPlayers } from "@/hooks/useAllPlayers";

export default function PlayerList() {
  const { allPlayers, loading, addPlayer } = useAllPlayers();
  const [name, setName] = useState("");

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPlayer(name);
      setName(""); // 清空输入框
    } catch (err: any) {
      alert(err.message || "添加失败");
    }
  };

  return (
    <Card className="w-full max-w-xl shadow-md">
      <CardContent className="py-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">玩家列表</h1>

        {loading ? (
          <p className="text-sm text-muted-foreground">加载中...</p>
        ) : allPlayers.length > 0 ? (
          <ul className="space-y-2">
            {allPlayers.map((player) => (
              <li
                key={player.id}
                className="bg-muted px-4 py-2 rounded-md text-foreground hover:bg-green-100 dark:hover:bg-green-800 transition-colors duration-200"
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
      </CardContent>
    </Card>
  );
}
