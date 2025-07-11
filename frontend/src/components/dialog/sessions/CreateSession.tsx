"use client";

type Props = {
  date: Date;
  onCreate: () => Promise<void>;
};

export default function CreateSessionPrompt({ date, onCreate }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm">
        {date.toLocaleDateString()} 暂无 Session，是否新建？
      </p>
      <button
        onClick={onCreate}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        创建 Session
      </button>
    </div>
  );
}
