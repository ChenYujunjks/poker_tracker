import { useState, useEffect } from "react";
import type { PlayerRecord, PlayerOption } from "@/lib/types";

export function useGameRecords(
  sessionId: number | null,
  allPlayers: PlayerOption[]
) {
  const [records, setRecords] = useState<PlayerRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/game-records?session_id=${sessionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  useEffect(() => {
    fetchRecords();
  }, [sessionId, allPlayers]);

  return { records, setRecords, loading, refetch: fetchRecords }; // ✅ 添加 refetch
}
