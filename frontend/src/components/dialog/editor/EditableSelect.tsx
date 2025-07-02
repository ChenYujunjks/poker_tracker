// components/editors/SelectEditor.tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import React from "react";

type Option = {
  label: string;
  value: string;
};

interface SelectEditorProps {
  value: string;
  options: Option[];
  onChange: (v: string) => void;
}

const SelectEditor = React.memo(
  ({ value, options, onChange }: SelectEditorProps) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="请选择" />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
);

export default SelectEditor;
