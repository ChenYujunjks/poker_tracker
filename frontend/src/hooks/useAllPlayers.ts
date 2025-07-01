// hooks/useAllPlayers.ts
import { useEffect, useState, useCallback } from "react";

export function useAllPlayers() {
  const [allPlayers, setPlayers] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/players", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("获取玩家失败");
      const data = await res.json();
      setPlayers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPlayer = async (name: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/api/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "添加失败");
    }

    await fetchPlayers(); // 添加后刷新列表
  };

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return { allPlayers, loading, addPlayer };
}
