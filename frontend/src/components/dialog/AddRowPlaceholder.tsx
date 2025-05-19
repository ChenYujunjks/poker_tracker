// calendar-dialog/AddRowPlaceholder.tsx
type Props = {
  onClick: () => void;
};

export default function AddRowPlaceholder({ onClick }: Props) {
  return (
    <tr>
      <td
        colSpan={4}
        onClick={onClick}
        className="text-center text-zinc-400 italic py-2 cursor-pointer hover:text-blue-500"
      >
        + 点击添加玩家
      </td>
    </tr>
  );
}
