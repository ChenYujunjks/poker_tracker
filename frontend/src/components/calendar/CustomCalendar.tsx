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
        const newEvents: Record<string, string[]> = {};
        const newSessionMap: Record<string, number> = {};
        data.forEach((session) => {
          // 如果后端直接返回 "YYYY-MM-DD"，这里可以直接用
          // 如果返回 ISO，就先转一下
          const dateKey = normalizeDate(session.date);
          newEvents[dateKey] = [];
          newSessionMap[dateKey] = session.id;
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

      {/* Custom Dialog */}
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

// 把 Date 转成 "YYYY-MM-DD"
const key = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// 兼容后端返回的格式（无论是 ISO 还是 YYYY-MM-DD）
const normalizeDate = (dateStr: string): string => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr; // 已经是 YYYY-MM-DD
  }
  const d = new Date(dateStr);
  return key(d);
};
