"use client";

import { useAllPlayers } from "@/hooks/useAllPlayers";
import { useGameRecords } from "@/hooks/useGameRecords";
import PlayerTable from "./PlayerTable";

export default function PlayerTableContainer({
  sessionId,
}: {
  sessionId: number;
}) {
  const { allPlayers } = useAllPlayers();
  const { records, setRecords, refetch } = useGameRecords(
    sessionId,
    allPlayers
  );

  const playerOptions = allPlayers.map((p) => ({
    id: p.id,
    name: p.name,
  }));

  return (
    <PlayerTable
      records={records}
      setRecords={setRecords}
      refetch={refetch}
      sessionId={sessionId}
      playerOptions={playerOptions} // ✅ 保留给 SelectEditor 用
    />
  );
}
