// components/dialog/PlayerTableContainer.tsx
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

  return (
    <PlayerTable
      records={records}
      setRecords={setRecords}
      refetch={refetch}
      sessionId={sessionId}
    />
  );
}
