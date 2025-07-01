"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";

import { useAllPlayers } from "@/hooks/useAllPlayers";

export default function PlayerList() {
  const { allPlayers, loading, addPlayer, deletePlayer } = useAllPlayers();
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
                className="group flex items-center justify-between bg-muted px-4 py-2 rounded-md text-foreground hover:bg-green-100 dark:hover:bg-green-800 transition-colors duration-200"
              >
                <span>{player.name}</span>
                <ConfirmDialog
                  title={`确定要删除玩家「${player.name}」吗？`}
                  description="该操作不可撤销，将永久删除玩家数据。"
                  onConfirm={async () => {
                    try {
                      await deletePlayer(player.id);
                    } catch (err: any) {
                      alert(err.message || "删除失败");
                    }
                  }}
                  trigger={
                    <Button
                      variant="destructive"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-700 hover:scale-105"
                    >
                      删除
                    </Button>
                  }
                />
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
