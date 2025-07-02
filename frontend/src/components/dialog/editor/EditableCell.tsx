// components/dialog/editor/EditableCell.tsx
import { useState, useEffect } from "react";

type Props = {
  value: any;
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
      e.currentTarget.blur();
    }
  };

  // 动态渲染不同类型的输入组件
  if (columnKey === "paid") {
    return (
      <input
        type="checkbox"
        checked={!!editingValue}
        onChange={(e) => onSave(rowId, columnKey, e.target.checked)}
      />
    );
  }

  const isNumeric = columnKey === "buy_in" || columnKey === "cash_out";

  return (
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
  );
}
