// calendar-dialog/PlayerTable.tsx
import { useState } from "react";
import EditableCell from "./EditableCell";
import AddRowPlaceholder from "./AddRowPlaceholder";

type PlayerRecord = {
  name: string;
  buyIn: number;
  cashOut: number;
  paid: boolean;
};

type Props = {
  data: PlayerRecord[];
  onChange: (updated: PlayerRecord[]) => void;
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

  const handleAddNew = () => {
    const newPlayer: PlayerRecord = {
      name: "",
      buyIn: 0,
      cashOut: 0,
      paid: false,
    };
    onChange([...data, newPlayer]);
    setEditingIndex(data.length); // 开始编辑新行
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
