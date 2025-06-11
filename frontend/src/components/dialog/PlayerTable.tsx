// calendar-dialog/PlayerTable.tsx
import { useState } from "react";
import EditableCell from "./EditableCell";
import AddRowPlaceholder from "./AddRowPlaceholder";

export type PlayerRecord = {
  playerId: number; // 新增 playerId
  name: string; // 从已知玩家列表中显示
  buyIn: number;
  cashOut: number;
  paid: boolean;
};

type Props = {
  data: PlayerRecord[];
  onChange: (updated: PlayerRecord[]) => void;
  playerOptions: { id: number; name: string }[]; // 新增字段：所有可选玩家
  sessionId: number; // 新增字段：当前日期的 sessionId（你需传入）
};

export default function PlayerTable({ data, onChange }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

  const handleAddNew = async () => {
    const playerId = prompt("请输入玩家 ID"); // 简化版，建议用 Select UI
    if (!playerId) return;

    const token = localStorage.getItem("token");

    const newRecord = {
      session_id: sessionId,
      player_id: Number(playerId),
      buy_in: 0,
      cash_out: 0,
      paid: false,
    };

    const res = await fetch("http://localhost:8080/api/game-records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newRecord),
    });

    if (res.ok) {
      const created = await res.json();
      const matched = playerOptions.find((p) => p.id === created.player_id);
      const newPlayer: PlayerRecord = {
        playerId: created.player_id,
        name: matched?.name || "未知",
        buyIn: created.buy_in ?? 0,
        cashOut: created.cash_out ?? 0,
        paid: created.paid ?? false,
      };
      onChange([...data, newPlayer]);
    } else {
      alert("创建游戏记录失败");
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
        <AddRowPlaceholder onClick={handleAddNew} />
      </tbody>
    </table>
  );
}
