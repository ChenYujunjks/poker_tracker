import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  value: string;
  isEditing: boolean;
  onChange: (val: string) => void;
  onEdit: () => void;
  mode?: "text" | "select";
  selectOptions?: { label: string; value: string }[]; // 仅 Select 模式使用
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
          <Select
            onValueChange={(val) => {
              setLocalValue(val);
              onChange(val);
            }}
            value={localValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择玩家" />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <input
            value={localValue}
            autoFocus
            onBlur={() => onChange(localValue)}
            onChange={(e) => setLocalValue(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-1.5 text-base bg-white dark:bg-zinc-800"
          />
        )
      ) : (
        <span className="text-zinc-900 dark:text-zinc-100">{value || "—"}</span>
      )}
    </td>
  );
}
