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
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [sessionIdMap, setSessionIdMap] = useState<Record<string, number>>({});

  const handleSessionCreated = (sessionId: number, date: string) => {
    setEvents((prev) => ({ ...prev, [date]: [] }));
    setSessionIdMap((prev) => ({ ...prev, [date]: sessionId }));
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
        selected={activeDate ? new Date(activeDate) : undefined}
        onDayClick={(d) => {
          console.log("你点击了日期:", d, "格式化后:", key(d));
          setActiveDate(key(d));
        }}
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
        date={activeDate} // ✅ 传字符串，而不是 Date
        hasSession={activeDate ? !!events[activeDate] : false}
        sessionId={activeDate ? sessionIdMap[activeDate] ?? null : null}
        onSessionCreated={(id, d) => handleSessionCreated(id, d)}
      />
    </>
  );
}

// 把 Date 转成 YYYY-MM-DD
const key = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
