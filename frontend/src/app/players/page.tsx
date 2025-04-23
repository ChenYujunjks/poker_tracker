"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Players() {
  const [players, setPlayers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:8080/api/players", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("获取玩家失败");
        return res.json();
      })
      .then((data) => {
        console.log("添加玩家成功", data);
        setPlayers(data);
      })
      .catch((err) => alert(err.message));
  }, [router]);

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/api/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (res.ok) {
      const refreshed = await fetch("http://localhost:8080/api/players", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedPlayers = await refreshed.json();
      setPlayers(updatedPlayers);
      setName("");
    } else {
      alert(data.error || "添加玩家失败");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-start px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">玩家列表</h1>

      {players && players.length > 0 ? (
        <ul className="mb-6 w-full max-w-md space-y-2">
          {players.map((player) => (
            <li
              key={player.id}
              className="bg-gray-800 px-4 py-2 rounded shadow-sm hover:bg-gray-700"
            >
              {player.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-6 text-gray-400">
          您还没有任何 player，请先添加 player。
        </p>
      )}

      <form
        onSubmit={handleAddPlayer}
        className="flex flex-col md:flex-row items-center w-full max-w-md gap-2 mb-6"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="新玩家名称"
          required
          className="flex-grow px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          添加玩家
        </button>
      </form>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
        className="text-sm text-red-400 hover:underline"
      >
        退出登录
      </button>
    </div>
  );
}
