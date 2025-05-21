"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PlayerSession = {
  name: string;
  buyIn: number;
  cashOut: number;
  paid: boolean;
};

type Props = {
  activeDate: Date | null;
  setActiveDate: (date: Date | null) => void;
  events: Record<string, PlayerSession[]>;
  setEvents: (events: Record<string, PlayerSession[]>) => void;
};

export default function CalendarDialog({
  activeDate,
  setActiveDate,
  events,
  setEvents,
}: Props) {
  const [editingCell, setEditingCell] = useState<{
    row: number;
    field: keyof PlayerSession;
  } | null>(null);

  const [newPlayer, setNewPlayer] = useState<PlayerSession>({
    name: "",
    buyIn: 0,
    cashOut: 0,
    paid: false,
  });

  const k = key(activeDate ?? new Date());
  const list = events[k] ?? [];

  const updatePlayer = (
    index: number,
    field: keyof PlayerSession,
    value: string
  ) => {
    const updated = [...list];
    if (field === "paid") {
      updated[index][field] = value === "true";
    } else if (field === "buyIn" || field === "cashOut") {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value;
    }
    setEvents({ ...events, [k]: updated });
  };

  const addPlayer = () => {
    if (!newPlayer.name.trim()) return;
    const updated = [...list, newPlayer];
    setEvents({ ...events, [k]: updated });
    setNewPlayer({ name: "", buyIn: 0, cashOut: 0, paid: false });
  };

  return (
    <Dialog
      open={!!activeDate}
      onOpenChange={(open) => !open && setActiveDate(null)}
    >
      <DialogContent className="sm:max-w-2xl bg-white text-black dark:bg-zinc-900 dark:text-white">
        <DialogHeader>
          <DialogTitle>{activeDate?.toLocaleDateString()} Sessions</DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-zinc-300 dark:border-zinc-700">
                <th className="py-2">玩家</th>
                <th>买入</th>
                <th>Cash-out</th>
                <th>已支付</th>
              </tr>
            </thead>
            <tbody>
              {list.map((player, i) => (
                <tr
                  key={i}
                  className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  {(["name", "buyIn", "cashOut", "paid"] as const).map(
                    (field) => (
                      <td
                        key={field}
                        className="py-2 px-1 cursor-pointer"
                        onClick={() => setEditingCell({ row: i, field })}
                      >
                        {editingCell?.row === i &&
                        editingCell?.field === field ? (
                          <input
                            autoFocus
                            className="w-full rounded bg-zinc-200 dark:bg-zinc-700 px-1"
                            defaultValue={String(player[field])}
                            onBlur={(e) => {
                              updatePlayer(i, field, e.target.value);
                              setEditingCell(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                updatePlayer(
                                  i,
                                  field,
                                  (e.target as HTMLInputElement).value
                                );
                                setEditingCell(null);
                              }
                            }}
                          />
                        ) : field === "paid" ? (
                          player.paid ? (
                            "✅"
                          ) : (
                            "❌"
                          )
                        ) : (
                          player[field]
                        )}
                      </td>
                    )
                  )}
                </tr>
              ))}

              {/* 新增一行 */}
              <tr className="text-zinc-500 dark:text-zinc-400">
                <td>
                  <input
                    placeholder="请添加玩家..."
                    className="w-full bg-transparent outline-none border-b dark:border-zinc-700"
                    value={newPlayer.name}
                    onChange={(e) =>
                      setNewPlayer((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="w-full bg-transparent outline-none border-b"
                    value={newPlayer.buyIn}
                    onChange={(e) =>
                      setNewPlayer((prev) => ({
                        ...prev,
                        buyIn: Number(e.target.value),
                      }))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="w-full bg-transparent outline-none border-b"
                    value={newPlayer.cashOut}
                    onChange={(e) =>
                      setNewPlayer((prev) => ({
                        ...prev,
                        cashOut: Number(e.target.value),
                      }))
                    }
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={newPlayer.paid}
                    onChange={(e) =>
                      setNewPlayer((prev) => ({
                        ...prev,
                        paid: e.target.checked,
                      }))
                    }
                    className="scale-125"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-2 text-right">
            <button
              onClick={addPlayer}
              className="px-4 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
              disabled={!newPlayer.name.trim()}
            >
              添加玩家
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const key = (d: Date) => d.toISOString().split("T")[0];
