"use client";

import { Button } from "@/components/ui/button";
import { useDeleteSession } from "@/hooks/useDeleteSession";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";

type Props = {
  sessionId: number;
  onDeleted: () => void; // 成功后回调，比如关闭 dialog
};

export default function DeleteSessionButton({ sessionId, onDeleted }: Props) {
  const { deleteSession } = useDeleteSession();

  return (
    <ConfirmDialog
      title="确定要删除该 Session 吗？"
      description="该操作不可撤销，会清除当天所有记录。"
      onConfirm={async () => {
        try {
          await deleteSession(sessionId);
          toast.success("删除成功");
          onDeleted(); // 通知父组件刷新或关闭
        } catch (err: any) {
          toast.error(err.message || "删除失败");
        }
      }}
      trigger={
        <Button variant="destructive" size="sm">
          删除 Session
        </Button>
      }
    />
  );
}
