// components/ui/empty-state.tsx
import { ReactNode } from "react";
import { Ban } from "lucide-react";

type EmptyStateProps = {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode; // 可传按钮或表单等操作
};

export default function EmptyState({
  icon = <Ban className="w-10 h-10 text-muted-foreground" />,
  title = "暂无数据",
  description = "当前暂无内容，请添加或尝试刷新。",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
      {icon}
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
