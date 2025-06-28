// components/dialog/index.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PlayerTable from "./PlayerTable";
import { useState, useEffect } from "react";

import type { PlayerRecord } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  date: Date | null;
  hasSession: boolean;
  sessionId: number | null;
  onSessionCreated?: (sessionId: number, date: Date) => void;
};

export default function CustomDialog({
  open,
  onClose,
  date,
  hasSession,
  sessionId,
  onSessionCreated,
}: Props) {
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [allPlayers, setAllPlayers] = useState<{ id: number; name: string }[]>(
    []
  );
  // 获取所有可选玩家
  useEffect(() => {
    const fetchPlayers = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/players", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAllPlayers(data);
    };
    fetchPlayers();
  }, []);

  // 获取当前 session 的游戏记录
  useEffect(() => {
    const fetchRecords = async () => {
      if (!sessionId) return;
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/game-records?session_id=${sessionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      const safeData = Array.isArray(data) ? data : []; // ✅ 最稳妥
      const enriched = safeData.map((r: any) => {
        const matched = allPlayers.find((p) => p.id === r.player_id);
        return {
          playerId: r.player_id,
          name: matched?.name || "未知",
          buyIn: r.buy_in ?? 0,
          cashOut: r.cash_out ?? 0,
          paid: r.paid ?? false,
        };
      });
      setPlayers(enriched);
    };
    fetchRecords();
  }, [sessionId, allPlayers]);
  // 创建新 session 的操作
  const handleCreateSession = async () => {
    if (!date) return;
    const token = localStorage.getItem("token");
    const formattedDate = date.toISOString().split("T")[0];
    const res = await fetch("http://localhost:8080/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ date: formattedDate }),
    });

    if (res.ok) {
      const created = await res.json();
      onSessionCreated?.(created.id, date); // ✅ 通知父组件
    } else {
      const err = await res.json();
      alert(err.error || "创建 session 失败");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-3xl p-6 bg-white text-black dark:bg-zinc-900 dark:text-white">
        <DialogHeader>
          <DialogTitle>{date?.toLocaleDateString()} 的游戏记录</DialogTitle>
        </DialogHeader>

        {!hasSession || !sessionId ? (
          <div className="space-y-4">
            <p className="text-sm">该日期暂无 Session，是否新建？</p>
            <button
              onClick={handleCreateSession}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              创建 Session
            </button>
          </div>
        ) : (
          <PlayerTable
            data={players}
            onChange={setPlayers}
            playerOptions={allPlayers}
            sessionId={sessionId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
