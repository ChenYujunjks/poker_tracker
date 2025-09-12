// hooks/useGameRecords.ts
import { useState, useEffect } from "react";
import type { PlayerRecord, PlayerOption } from "@/lib/types";

export function useGameRecords(
  sessionId: number | null,
  allPlayers: PlayerOption[]
) {
  const [records, setRecords] = useState<PlayerRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // GET
  const fetchRecords = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/game-records?session_id=${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`请求失败: ${res.status}`);

      const data = await res.json();
      const safeData = Array.isArray(data) ? data : [];
      const enriched: PlayerRecord[] = safeData.map((r: any) => {
        const matched = allPlayers.find((p) => p.id === r.player_id);
        return {
          id: r.id,
          playerId: r.player_id,
          name: matched?.name || "未知",
          buyIn: r.buy_in ?? 0,
          cashOut: r.cash_out ?? 0,
          paid: r.paid ?? false,
        };
      });
      setRecords(enriched);
    } catch (err) {
      console.error("❌ fetchRecords error:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // POST
  const addRecord = async (record: Omit<PlayerRecord, "id">) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/game-records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        session_id: sessionId,
        player_id: record.playerId,
        buy_in: record.buyIn,
        cash_out: record.cashOut,
        paid: record.paid,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "添加失败");
    }

    await fetchRecords(); // ✅ 添加后刷新
  };

  // PUT (更新)
  const updateRecord = async (id: number, field: string, value: any) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/game-records/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ [field]: value }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "更新失败");
    }

    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, [field]: value } : rec))
    );
  };

  useEffect(() => {
    fetchRecords();
  }, [sessionId, allPlayers]);

  return {
    records,
    setRecords, //有待商榷
    loading,
    fetchRecords,
    updateRecord,
    addRecord,
  };
}
