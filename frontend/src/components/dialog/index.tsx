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
};

export default function CustomDialog({ open, onClose, date }: Props) {
  const [players, setPlayers] = useState<PlayerRecord[]>([]); // 后期可以替换为从后端加载的数据

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-3xl p-6 bg-white text-black dark:bg-zinc-900 dark:text-white">
        <DialogHeader>
          <DialogTitle>{date?.toLocaleDateString()} 的游戏记录</DialogTitle>
        </DialogHeader>

        <PlayerTable data={players} onChange={setPlayers} />
      </DialogContent>
    </Dialog>
  );
}
