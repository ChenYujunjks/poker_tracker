"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import CustomDialog from "../dialog";

const DayPicker = dynamic(
  () => import("react-day-picker").then((m) => m.DayPicker),
  { ssr: false }
);

export default function CustomCalendar() {
  const [events, setEvents] = useState<Record<string, string[]>>({});
  const [activeDate, setActiveDate] = useState<Date | null>(null);
  // 将 date 数组转换为 events 字典（每个日期一个空数组或初始备注）

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
        data.forEach((session) => {
          const dateKey = key(new Date(session.date));
          newEvents[dateKey] = []; // 或你可以加上初始描述，如 [`Session #${session.id}`]
        });
        setEvents(newEvents);
      })
      .catch((err) => alert(err.message));
  }, []);

  const addEvent = useCallback(
    (text: string) => {
      if (!activeDate) return;
      const k = key(activeDate);
      setEvents((prev) => ({ ...prev, [k]: [...(prev[k] ?? []), text] }));
    },
    [activeDate]
  );

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
      />
    </>
  );
}

const key = (d: Date) => d.toISOString().split("T")[0];
