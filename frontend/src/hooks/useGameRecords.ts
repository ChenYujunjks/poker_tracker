import { useState, useEffect } from "react";
import type { PlayerRecord } from "@/lib/types";

export function useGameRecords(sessionId: number | null, allPlayers: any[]) {
  const [records, setRecords] = useState<PlayerRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    const fetchRecords = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/game-records?session_id=${sessionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      const safeData = Array.isArray(data) ? data : [];
      const enriched = safeData.map((r: any) => {
        const matched = allPlayers.find((p) => p.id === r.player_id);
        return {
          id: r.id, // ✅ 添加这个字段
          playerId: r.player_id,
          name: matched?.name || "未知",
          buyIn: r.buy_in ?? 0,
          cashOut: r.cash_out ?? 0,
          paid: r.paid ?? false,
        };
      });
      setRecords(enriched);
      setLoading(false);
    };
    fetchRecords();
  }, [sessionId, allPlayers]);

  return { records, setRecords, loading };
}
