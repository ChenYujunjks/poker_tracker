// components/dialog/index.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PlayerTable from "./PlayerTable";
import { useAllPlayers } from "@/hooks/useAllPlayers";
import { useGameRecords } from "@/hooks/useGameRecords";
import { useCreateSession } from "@/hooks/useCreateSession";

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
  const { allPlayers, loading: playersLoading } = useAllPlayers();
  const {
    records,
    setRecords,
    loading: recordsLoading,
  } = useGameRecords(sessionId, allPlayers);
  const { createSession } = useCreateSession();
  // 创建新 session 的操作
  const handleCreateSession = async () => {
    if (!date) return;
    try {
      const created = await createSession(date);
      onSessionCreated?.(created.id, date); // 通知父组件刷新状态
    } catch (err: any) {
      alert(err.message || "创建 session 失败");
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
            data={records}
            onChange={setRecords}
            playerOptions={allPlayers}
            sessionId={sessionId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
