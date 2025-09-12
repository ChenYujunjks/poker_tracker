// components/dialog/CustomDialog.tsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import CreateSessionPrompt from "./Sessions/CreateSession";
import DeleteSessionButton from "./Sessions/DeleteSessionButton";
import PlayerTableContainer from "./PlayerContainer";

import { useCreateSession } from "@/hooks/sessions/useCreateSession";

type Props = {
  open: boolean;
  onClose: () => void;
  date: string | null;
  hasSession: boolean;
  sessionId: number | null;
  onSessionCreated?: (sessionId: number, date: string) => void;
};

export default function CustomDialog({
  open,
  onClose,
  date,
  hasSession,
  sessionId,
  onSessionCreated,
}: Props) {
  const { createSession } = useCreateSession();

  const handleCreateSession = async () => {
    if (!date) return;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    if (date > todayStr) {
      toast.error("不能创建未来日期的 session");
      return;
    }

    try {
      const created = await createSession(date);
      onSessionCreated?.(created.id, date);
    } catch (err: any) {
      toast.error(err.message || "创建 session 失败");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-3xl p-6 bg-white text-black dark:bg-zinc-900 dark:text-white">
        <DialogHeader>
          <DialogTitle>
            {date ? `${date} 的游戏记录` : "请选择日期"}
          </DialogTitle>
          <DialogDescription>
            在这里查看或管理该日期的游戏 Session
          </DialogDescription>
        </DialogHeader>

        {/* ✅ 要么显示创建，要么显示表格 */}
        {!hasSession || !sessionId ? (
          date ? (
            <CreateSessionPrompt date={date} onCreate={handleCreateSession} />
          ) : null
        ) : (
          <>
            <PlayerTableContainer sessionId={sessionId} />
            <div className="mt-6 flex justify-end">
              <DeleteSessionButton sessionId={sessionId} onDeleted={onClose} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
