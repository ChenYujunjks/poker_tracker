"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import CustomDialog from "./dialog";
import CalendarDialog from "./CalendarDialog";

const DayPicker = dynamic(
  () => import("react-day-picker").then((m) => m.DayPicker),
  { ssr: false }
);

export default function CustomCalendar() {
  const [events, setEvents] = useState<Record<string, string[]>>({
    "2025-05-05": ["Buy-in 200 / Cash-out 350"],
    "2025-05-12": ["Session with Mike"],
    "2025-06-27": ["Evening game"],
    "2025-05-27": ["WSOP satellite"],
  });

  const [activeDate, setActiveDate] = useState<Date | null>(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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

      {/* <CalendarDialog
        activeDate={activeDate}
        setActiveDate={setActiveDate}
        events={events}
        setEvents={setEvents}
      />*/}

      {/* Custom Dialog */}
      <CustomDialog
        open={!!activeDate}
        onClose={() => setActiveDate(null)}
        date={activeDate}
      />
    </>
  );
}

const key = (d: Date) => d.toISOString().split("T")[0];
