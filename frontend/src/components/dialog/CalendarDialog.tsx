"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  activeDate: Date | null;
  setActiveDate: (date: Date | null) => void;
  events: Record<string, string[]>;
  inputValue: string;
  setInputValue: (val: string) => void;
  addEvent: (text: string) => void;
};

export default function CalendarDialog({
  activeDate,
  setActiveDate,
  events,
  inputValue,
  setInputValue,
  addEvent,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const k = key(activeDate ?? new Date());

  return (
    <Dialog
      open={!!activeDate}
      onOpenChange={(open) => !open && setActiveDate(null)}
    >
      <DialogContent className="sm:max-w-md bg-white text-black dark:bg-zinc-900 dark:text-white">
        <DialogHeader>
          <DialogTitle>{activeDate?.toLocaleDateString()} Sessions</DialogTitle>
        </DialogHeader>

        <ul className="space-y-2 mb-4 max-h-40 overflow-y-auto">
          {events[k]?.length ? (
            events[k].map((ev, i) => (
              <li key={i} className="rounded bg-zinc-100 dark:bg-zinc-800 p-2">
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
            className="flex-1 rounded border px-2 py-1 text-sm bg-transparent outline-none focus:ring-1 dark:border-zinc-700"
          />
          <button
            onClick={() => {
              if (inputValue.trim()) {
                addEvent(inputValue.trim());
                setInputValue("");
                inputRef.current?.focus();
              }
            }}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-40"
            disabled={!inputValue.trim()}
          >
            Add
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const key = (d: Date) => d.toISOString().split("T")[0];
