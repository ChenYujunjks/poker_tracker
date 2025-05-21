"use client";

import { useRouter } from "next/navigation";
import WithAuth from "@/components/WithAuth";
import PlayerList from "@/components/player/PlayerList";

function Players() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center px-4 py-10">
      <PlayerList />
      <div className="text-center mt-4">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="text-sm text-destructive hover:underline"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default WithAuth(Players);
