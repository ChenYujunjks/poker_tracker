// components/dialog/PlayerTable.tsx
import { useState } from "react";
import EditableCell from "./EditableCell";
import AddRowPlaceholder from "./AddRowPlaceholder";
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
  const [newRecord, setNewRecord] = useState<PlayerRecord>({
    playerId: -1,
    name: "",
    buyIn: 0,
    cashOut: 0,
    paid: false,
  });

  type PlayerRecordField = string | number | boolean;

  const updateField = (
    index: number,
    field: keyof PlayerRecord,
    value: PlayerRecordField
  ) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
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
            key={index}
            className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <EditableCell
              value={player.name}
              isEditing={editingIndex === index}
              onChange={(val) => updateField(index, "name", val)}
              onEdit={() => setEditingIndex(index)}
            />
            <EditableCell
              value={String(player.buyIn)}
              isEditing={editingIndex === index}
              onChange={(val) => updateField(index, "buyIn", Number(val))}
              onEdit={() => setEditingIndex(index)}
            />
            <EditableCell
              value={String(player.cashOut)}
              isEditing={editingIndex === index}
              onChange={(val) => updateField(index, "cashOut", Number(val))}
              onEdit={() => setEditingIndex(index)}
            />
            <td className="px-2 py-1">
              <input
                type="checkbox"
                checked={player.paid}
                onChange={(e) => updateField(index, "paid", e.target.checked)}
              />
            </td>
          </tr>
        ))}

        {adding ? (
          <tr className="bg-zinc-50 dark:bg-zinc-800">
            <EditableCell
              value={newRecord.name}
              isEditing={true}
              mode="select"
              selectOptions={playerOptions.map((p) => ({
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
              onEdit={() => {}}
            />

            <EditableCell
              value={newRecord.buyIn.toString()}
              isEditing={true}
              onChange={(val) =>
                setNewRecord((prev) => ({ ...prev, buyIn: Number(val) }))
              }
              onEdit={() => {}}
            />
            <EditableCell
              value={newRecord.cashOut.toString()}
              isEditing={true}
              onChange={(val) =>
                setNewRecord((prev) => ({ ...prev, cashOut: Number(val) }))
              }
              onEdit={() => {}}
            />
            <td className="px-2 py-1">
              <input
                type="checkbox"
                checked={newRecord.paid}
                onChange={(e) =>
                  setNewRecord((prev) => ({
                    ...prev,
                    paid: e.target.checked,
                  }))
                }
              />
            </td>
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
                    onChange([...data, newRecord]);
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
