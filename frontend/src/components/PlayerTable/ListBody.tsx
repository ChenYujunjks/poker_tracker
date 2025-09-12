// components/player/ListBody.tsx
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/ui/empty-state";

type Player = {
  id: number;
  name: string;
};

type Props = {
  allPlayers: Player[] | null | undefined;
  loading: boolean;
  deletePlayer: (id: number) => Promise<void>;
};

export default function PlayerListBody({
  allPlayers,
  loading,
  deletePlayer,
}: Props) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">加载中...</p>;
  }

  if (!Array.isArray(allPlayers) || allPlayers.length === 0) {
    return (
      <EmptyState
        title="还没有玩家"
        description="请先添加一名玩家以开始记录。"
      />
    );
  }

  return (
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
  );
}
