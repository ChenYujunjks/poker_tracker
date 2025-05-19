// calendar-dialog/EditableCell.tsx
import { useState } from "react";

type Props = {
  value: string;
  isEditing: boolean;
  onChange: (val: string) => void;
  onEdit: () => void;
};

export default function EditableCell({
  value,
  isEditing,
  onChange,
  onEdit,
}: Props) {
  const [localValue, setLocalValue] = useState(value);

  return (
    <td
      className="px-2 py-1 cursor-pointer"
      onClick={() => {
        if (!isEditing) onEdit();
      }}
    >
      {isEditing ? (
        <input
          value={localValue}
          autoFocus
          onBlur={() => onChange(localValue)}
          onChange={(e) => setLocalValue(e.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-1.5 text-base bg-white dark:bg-zinc-800"
        />
      ) : (
        <span className="text-zinc-900 dark:text-zinc-100">{value || "—"}</span>
      )}
    </td>
  );
}
