// app/404.tsx
"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - 页面未找到</h1>
      <p className="text-gray-400 mb-6 text-center">
        很抱歉，你访问的页面不存在。
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        返回首页
      </button>
    </div>
  );
}
