// components/dialog/editor/EditableCheckbox.tsx
type Props = {
  checked: boolean;
  rowId: number;
  columnKey: string;
  onSave: (rowId: number, columnKey: string, newValue: boolean) => void;
};

export default function EditableCheckbox({
  checked,
  rowId,
  columnKey,
  onSave,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    if (newValue !== checked) {
      onSave(rowId, columnKey, newValue);
    }
  };

  return (
    <td className="px-2 py-1">
      <input type="checkbox" checked={checked} onChange={handleChange} />
    </td>
  );
}
