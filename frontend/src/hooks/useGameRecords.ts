// hooks/useGameRecords.ts
import { useState, useEffect } from "react";
import type { PlayerRecord } from "@/lib/types";

export function useGameRecords(sessionId: number | null) {
  const [records, setRecords] = useState<PlayerRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    if (!sessionId) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:8080/api/game-records?session_id=${sessionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setRecords(Array.isArray(data) ? data : []); // ❌ 不 enrich，直接存原始
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, [sessionId]);

  return { records, setRecords, loading, refetch: fetchRecords };
}
