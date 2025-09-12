"use client";

import { useState } from "react";
import EditableCell from "./Editor/EditableCell";
import SelectEditor from "./Editor/EditableSelect";
import EditableCheckbox from "./Editor/EditableCheckbox";
import AddRowPlaceholder from "./Editor/AddRowPlaceholder";
import { toast } from "sonner";
import type { PlayerRecord } from "@/lib/types";

type Props = {
  records: PlayerRecord[];
  addRecord: (record: Omit<PlayerRecord, "id">) => Promise<void>;
  updateRecord: (id: number, field: string, value: any) => Promise<void>;
  playerOptions: { id: number; name: string }[];
};

export default function PlayerTable({
  records,
  addRecord,
  updateRecord,
  playerOptions,
}: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [newRecord, setNewRecord] = useState<Omit<PlayerRecord, "id">>({
    playerId: -1,
    name: "",
    buyIn: 0,
    cashOut: 0,
    paid: false,
  });

  // 更新单元格
  const handleCellSave = async (
    rowId: number,
    field: string,
    newValue: any
  ) => {
    try {
      await updateRecord(rowId, field, newValue);
      toast.success("已保存");
    } catch (err: any) {
      toast.error(err.message || "保存失败");
    }
  };

  // 添加新行
  const handleAdd = async () => {
    try {
      await addRecord(newRecord);
      toast.success("添加成功");
      setAdding(false);
      setNewRecord({
        playerId: -1,
        name: "",
        buyIn: 0,
        cashOut: 0,
        paid: false,
      });
    } catch (err: any) {
      toast.error(err.message || "添加失败");
    }
  };

  return (
    <table className="w-full border-collapse text-base">
      <thead>
        <tr className="text-left text-zinc-400">
          <th className="px-4 py-3">玩家</th>
          <th className="px-4 py-3">买入</th>
          <th className="px-4 py-3">Cash-out</th>
          <th className="px-4 py-3">已支付</th>
        </tr>
      </thead>
      <tbody>
        {records.map((player, index) => (
          <tr
            key={player.id?.toString() ?? `row-${index}`}
            className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <td className="px-2 py-1">
              {editingIndex === index ? (
                <SelectEditor
                  value={player.playerId.toString()}
                  options={playerOptions.map((p) => ({
                    label: p.name,
                    value: p.id.toString(),
                  }))}
                  onChange={(val) => {
                    const matched = playerOptions.find(
                      (p) => p.id.toString() === val
                    );
                    handleCellSave(player.id, "playerId", Number(val));
                    handleCellSave(player.id, "name", matched?.name || "");
                  }}
                />
              ) : (
                <span
                  className="cursor-pointer px-2 py-1 block"
                  onClick={() => setEditingIndex(index)}
                >
                  {player.name}
                </span>
              )}
            </td>

            <EditableCell
              value={player.buyIn}
              rowId={player.id}
              columnKey="buy_in"
              onSave={handleCellSave}
            />

            <EditableCell
              value={player.cashOut}
              rowId={player.id}
              columnKey="cash_out"
              onSave={handleCellSave}
            />

            <EditableCheckbox
              checked={player.paid}
              rowId={player.id}
              columnKey="paid"
              onSave={handleCellSave}
            />
          </tr>
        ))}

        {adding ? (
          <tr className="bg-zinc-50 dark:bg-zinc-800">
            <td className="px-2 py-1">
              <SelectEditor
                value={newRecord.playerId.toString()}
                options={playerOptions.map((p) => ({
                  label: p.name,
                  value: p.id.toString(),
                }))}
                onChange={(val) => {
                  const matched = playerOptions.find(
                    (p) => p.id.toString() === val
                  );
                  setNewRecord((prev) => ({
                    ...prev,
                    playerId: Number(val),
                    name: matched?.name || "",
                  }));
                }}
              />
            </td>

            <EditableCell
              value={newRecord.buyIn}
              rowId={-1}
              columnKey="buy_in"
              onSave={(_, __, val) =>
                setNewRecord((prev) => ({ ...prev, buyIn: Number(val) }))
              }
            />

            <EditableCell
              value={newRecord.cashOut}
              rowId={-1}
              columnKey="cash_out"
              onSave={(_, __, val) =>
                setNewRecord((prev) => ({ ...prev, cashOut: Number(val) }))
              }
            />

            <EditableCheckbox
              checked={newRecord.paid}
              rowId={-1}
              columnKey="paid"
              onSave={(_, __, val) =>
                setNewRecord((prev) => ({ ...prev, paid: Boolean(val) }))
              }
            />

            <td className="px-2 py-1">
              <button
                className="px-2 py-1 bg-green-600 text-white rounded mr-2"
                onClick={handleAdd}
              >
                添加
              </button>
              <button
                className="text-red-500 text-sm"
                onClick={() => setAdding(false)}
              >
                取消
              </button>
            </td>
          </tr>
        ) : (
          <AddRowPlaceholder onClick={() => setAdding(true)} />
        )}
      </tbody>
    </table>
  );
}
