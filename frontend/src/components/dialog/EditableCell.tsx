import { useState, useEffect } from "react";

type Props = {
  value: string;
  isEditing: boolean;
  onChange: (val: string) => void;
  onEdit: () => void;
  mode?: "text" | "select";
  selectOptions?: { label: string; value: string }[];
};

export default function EditableCell({
  value,
  isEditing,
  onChange,
  onEdit,
  mode = "text",
  selectOptions = [],
}: Props) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <td
      className="px-2 py-1 cursor-pointer"
      onClick={() => {
        if (!isEditing) onEdit();
      }}
    >
      {isEditing ? (
        mode === "select" ? (
          <select
            value={localValue}
            onChange={(e) => {
              const selected = e.target.value;
              setLocalValue(selected);
              onChange(selected);
            }}
            autoFocus
            className="w-full rounded border px-2 py-1 bg-white dark:bg-zinc-800"
          >
            <option value="">选择玩家</option>
            {selectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            value={localValue}
            autoFocus
            onBlur={() => onChange(localValue)}
            onChange={(e) => setLocalValue(e.target.value)}
            className="w-full rounded border px-2 py-1 bg-white dark:bg-zinc-800"
          />
        )
      ) : (
        <span className="text-zinc-900 dark:text-zinc-100">{value || "—"}</span>
      )}
    </td>
  );
}
