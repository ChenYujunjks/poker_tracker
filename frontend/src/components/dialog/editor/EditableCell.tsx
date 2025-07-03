import { useState, useEffect } from "react";

type Props = {
  value: string | number;
  rowId: number;
  columnKey: string;
  onSave: (rowId: number, columnKey: string, newValue: any) => void;
};

export default function EditableCell({
  value,
  rowId,
  columnKey,
  onSave,
}: Props) {
  const [editingValue, setEditingValue] = useState(value);

  useEffect(() => {
    setEditingValue(value); // 外部变更时同步更新
  }, [value]);

  const handleBlur = () => {
    if (editingValue !== value) {
      onSave(rowId, columnKey, editingValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur(); // 触发保存
    }
  };

  const isNumeric = columnKey === "buy_in" || columnKey === "cash_out";

  return (
    <td className="px-2 py-1">
      <input
        type={isNumeric ? "number" : "text"}
        className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
        value={editingValue ?? ""}
        onChange={(e) =>
          isNumeric
            ? setEditingValue(Number(e.target.value))
            : setEditingValue(e.target.value)
        }
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    </td>
  );
}
