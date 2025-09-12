import { useState } from "react";
import EditableCell from "./Editor/EditableCell";
import SelectEditor from "./Editor/EditableSelect";
import EditableCheckbox from "./Editor/EditableCheckbox";
import AddRowPlaceholder from "./Editor/AddRowPlaceholder";
import { toast } from "sonner";
import type { PlayerRecord } from "@/lib/types";

type Props = {
  records: PlayerRecord[];
  setRecords: (records: PlayerRecord[]) => void;
  refetch: () => void;
  playerOptions: { id: number; name: string }[];
  sessionId: number;
};

export default function PlayerTable({
  records,
  setRecords,
  refetch,
  playerOptions,
  sessionId,
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

  const handleCellSave = async (
    rowId: number,
    field: string,
    newValue: any
  ) => {
    if (!rowId || typeof rowId !== "number") {
      toast.error("非法记录 ID，无法更新");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/game-records/${rowId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ [field]: newValue }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "更新失败");
      }

      const updated = records.map((rec) =>
        rec.id === rowId ? { ...rec, [field]: newValue } : rec
      );
      setRecords(updated);
      toast.success("已保存");
    } catch (err: any) {
      toast.error(err.message || "保存失败");
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
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  const res = await fetch(
                    "http://localhost:8080/api/game-records",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        session_id: sessionId,
                        player_id: newRecord.playerId,
                        buy_in: newRecord.buyIn,
                        cash_out: newRecord.cashOut,
                        paid: newRecord.paid,
                      }),
                    }
                  );

                  if (res.ok) {
                    toast.success("添加成功");
                    setAdding(false);
                    setNewRecord({
                      playerId: -1,
                      name: "",
                      buyIn: 0,
                      cashOut: 0,
                      paid: false,
                    });
                    refetch(); // ✅ 添加后重新拉取数据
                  } else {
                    alert("添加失败");
                  }
                }}
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
