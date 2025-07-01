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
import CreateSessionPrompt from "./sessions/CreateSession";

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
  const { allPlayers } = useAllPlayers();
  const { records, setRecords, loading } = useGameRecords(
    sessionId,
    allPlayers
  );
  const { createSession } = useCreateSession();

  const handleCreateSession = async () => {
    if (!date) return;
    try {
      const created = await createSession(date);
      onSessionCreated?.(created.id, date);
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
          date ? (
            <CreateSessionPrompt date={date} onCreate={handleCreateSession} />
          ) : null
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
