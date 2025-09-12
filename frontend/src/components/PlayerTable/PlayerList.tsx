"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PlayerListBody from "@/components/PlayerTable/ListBody";
import { useAllPlayers } from "@/hooks/useAllPlayers";

export default function PlayerList() {
  const { allPlayers, loading, addPlayer, deletePlayer } = useAllPlayers();
  const [name, setName] = useState("");

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPlayer(name);
      setName("");
    } catch (err: any) {
      alert(err.message || "添加失败");
    }
  };

  return (
    <Card className="w-full max-w-xl shadow-md">
      <CardContent className="py-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">玩家列表</h1>

        <PlayerListBody
          allPlayers={allPlayers}
          loading={loading}
          deletePlayer={deletePlayer}
        />

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
