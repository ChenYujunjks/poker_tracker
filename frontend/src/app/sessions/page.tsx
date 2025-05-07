import CustomCalendar from "@/components/CustomCalendar";

export default function CalendarPage() {
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
