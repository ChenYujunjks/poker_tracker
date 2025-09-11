"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import CustomDialog from "../dialog/CustomDialog";

const DayPicker = dynamic(
  () => import("react-day-picker").then((m) => m.DayPicker),
  { ssr: false }
);

export default function CustomCalendar() {
  const [events, setEvents] = useState<Record<string, string[]>>({});
  const [activeDate, setActiveDate] = useState<Date | null>(null);
  const [sessionIdMap, setSessionIdMap] = useState<Record<string, number>>({});

  // 创建新的 session
  const handleSessionCreated = (sessionId: number, date: Date) => {
    const k = key(date);
    setEvents((prev) => ({ ...prev, [k]: [] }));
    setSessionIdMap((prev) => ({ ...prev, [k]: sessionId }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/sessions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("获取 session 失败");
        return res.json();
      })
      .then((data: { id: number; date: string }[]) => {
        // ✅ 后端直接返回 YYYY-MM-DD
        const newEvents: Record<string, string[]> = {};
        const newSessionMap: Record<string, number> = {};
        data.forEach((session) => {
          newEvents[session.date] = [];
          newSessionMap[session.date] = session.id;
        });
        setEvents(newEvents);
        setSessionIdMap(newSessionMap);
      })
      .catch((err) => alert(err.message));
  }, []);

  const modifiers = {
    hasEvent: (day: Date) => !!events[key(day)],
  };

  return (
    <>
      <DayPicker
        mode="single"
        selected={activeDate ?? undefined}
        onDayClick={(d) => setActiveDate(d)}
        modifiers={modifiers}
        modifiersClassNames={{
          hasEvent: "hasEvent",
        }}
        classNames={{
          table: "w-full border-separate border-spacing-2",
          cell: "text-center align-top h-14 w-14",
          day: "rounded-full hover:bg-gray-200 transition",
        }}
      />

      <CustomDialog
        open={!!activeDate}
        onClose={() => setActiveDate(null)}
        date={activeDate}
        hasSession={activeDate ? !!events[key(activeDate)] : false}
        sessionId={activeDate ? sessionIdMap[key(activeDate)] ?? null : null}
        onSessionCreated={handleSessionCreated}
      />
    </>
  );
}

// ✅ 统一 key 函数，保证前后端一致
const key = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
