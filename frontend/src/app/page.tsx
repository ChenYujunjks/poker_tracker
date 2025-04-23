// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] items-center justify-items-center bg-gray-100 dark:bg-zinc-900 p-8 sm:p-20 text-center font-sans">
      <header className="text-4xl font-bold text-gray-900 dark:text-white mt-10">
        Poker Tracker
      </header>

      <main className="flex flex-col items-center gap-6 row-start-2">
        <nav className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/players"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Players
          </Link>
          <Link
            href="/sessions"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Sessions
          </Link>
          <Link
            href="/api/logout"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Logout
          </Link>
          <Link
            href="/contact"
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Contact Me
          </Link>
        </nav>
      </main>

      <footer className="row-start-3 mt-20 text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Poker Tracker. All rights reserved.
      </footer>
    </div>
  );
}
