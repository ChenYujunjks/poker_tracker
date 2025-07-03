import { useState } from "react";
import EditableCell from "./editor/EditableCell";
import SelectEditor from "./editor/EditableSelect";
import EditableCheckbox from "./editor/EditableCheckbox";
import AddRowPlaceholder from "./editor/AddRowPlaceholder";
import { toast } from "sonner";
import type { PlayerRecord } from "@/lib/types";

type Props = {
  data: PlayerRecord[];
  onChange: (updated: PlayerRecord[]) => void;
  playerOptions: { id: number; name: string }[];
  sessionId: number;
};

export default function PlayerTable({
  data,
  onChange,
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

      const updated = data.map((rec) =>
        rec.id === rowId ? { ...rec, [field]: newValue } : rec
      );
      onChange(updated);
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
        {data.map((player, index) => (
          <tr
            key={player.id}
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
                    const saved = await res.json();
                    onChange([
                      ...data,
                      {
                        ...newRecord,
                        id: saved.id, // ✅ 关键！用 saved.id 存到记录主键
                      },
                    ]);
                    setAdding(false);
                    setNewRecord({
                      playerId: -1,
                      name: "",
                      buyIn: 0,
                      cashOut: 0,
                      paid: false,
                    });
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
