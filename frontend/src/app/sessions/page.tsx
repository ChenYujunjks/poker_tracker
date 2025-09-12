"use client";

import CustomCalendar from "@/components/Calendar/CustomCalendar";
import WithAuth from "@/components/WithAuth";

function SessionPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center gap-6 py-10
             bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
    >
      <h1 className="text-2xl font-bold">Poker Session Tracker</h1>
      <CustomCalendar />
    </main>
  );
}

export default WithAuth(SessionPage);
