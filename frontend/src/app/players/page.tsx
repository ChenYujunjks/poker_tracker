"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Players() {
  const [players, setPlayers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const router = useRouter();

  // 获取玩家列表
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
      .then((data) => setPlayers(data))
      .catch((err) => alert(err.message));
  }, [router]);

  // 添加新玩家
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
      setPlayers([...players, data]); // 更新玩家列表
      setName(""); // 清空输入框
    } else {
      alert(data.error || "添加玩家失败");
    }
  };

  return (
    <div>
      <h1>玩家列表</h1>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      <form onSubmit={handleAddPlayer}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="新玩家名称"
          required
        />
        <button type="submit">添加玩家</button>
      </form>
      <button
        onClick={() => {
          localStorage.removeItem("token"); // 清除 token
          router.push("/login"); // 跳转到登录页面
        }}
      >
        退出登录
      </button>
    </div>
  );
}
