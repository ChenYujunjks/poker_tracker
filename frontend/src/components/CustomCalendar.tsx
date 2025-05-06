"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DayPicker = dynamic(
  () => import("react-day-picker").then((m) => m.DayPicker),
  { ssr: false }
);

export default function CustomCalendar() {
  const [events, setEvents] = useState<Record<string, string[]>>({
    "2025-04-05": ["Buy-in 200 / Cash-out 350"],
    "2025-04-12": ["Session with Mike"],
    "2025-04-27": ["Evening game"],
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

      {/* Shadcn Dialog */}
      <Dialog
        open={!!activeDate}
        onOpenChange={(open) => !open && setActiveDate(null)}
      >
        <DialogContent className="sm:max-w-md bg-white text-black dark:bg-zinc-900 dark:text-white">
          <DialogHeader>
            <DialogTitle>
              {activeDate?.toLocaleDateString()} Sessions
            </DialogTitle>
          </DialogHeader>

          <ul className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {events[key(activeDate ?? new Date())]?.length ? (
              events[key(activeDate ?? new Date())].map((ev, i) => (
                <li
                  key={i}
                  className="rounded bg-zinc-100 dark:bg-zinc-800 p-2"
                >
                  {ev}
                </li>
              ))
            ) : (
              <li className="text-sm text-zinc-500">No sessions yet.</li>
            )}
          </ul>

          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue.trim()) {
                  addEvent(inputValue.trim());
                  setInputValue("");
                  inputRef.current?.focus();
                }
              }}
              placeholder="Add a note…"
              className="flex-1 rounded border px-2 py-1 text-sm
                        bg-transparent outline-none focus:ring-1
                        dark:border-zinc-700"
            />
            <button
              onClick={() => {
                if (inputValue.trim()) {
                  addEvent(inputValue.trim());
                  setInputValue("");
                  inputRef.current?.focus();
                }
              }}
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white
                        disabled:opacity-40"
              disabled={!inputValue.trim()}
            >
              Add
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

const key = (d: Date) => d.toISOString().split("T")[0];
