// components/calendar-dialog/index.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PlayerTable from "./PlayerTable";
import { useState } from "react";

export type PlayerRecord = {
  name: string;
  buyIn: number;
  cashOut: number;
  paid: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  date: Date | null;
  hasSession: boolean;
};

export default function CustomDialog({
  open,
  onClose,
  date,
  hasSession,
}: Props) {
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [creating, setCreating] = useState(false);

  const handleCreateSession = async () => {
    if (!date) return; // ✅ 检查 null
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
      setCreating(false);
      window.location.reload(); // 或者你可以调用父组件传入的刷新事件
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

        {!hasSession ? (
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
          <PlayerTable data={players} onChange={setPlayers} />
        )}
      </DialogContent>
    </Dialog>
  );
}
