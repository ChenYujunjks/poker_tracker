"use client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";
import "react-day-picker/dist/style.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="bg-gray-100 text-gray-900 dark:bg-zinc-900 dark:text-white transition-colors">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col items-center p-6">
            {/* 顶部导航栏 */}
            <header className="w-full max-w-4xl mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Poker Tracker</h1>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link
                  href="/players"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
                >
                  Players
                </Link>
                <Link
                  href="/sessions"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
                >
                  Sessions
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded border hover:bg-[#a7f3d0] hover:text-zinc-900 dark:hover:bg-[#34d399]/30 text-sm"
                >
                  Login
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("token"); // 清除 token
                    router.push("/"); // 跳转到登录页
                  }}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
                >
                  Logout
                </button>
              </div>
            </header>

            {/* 页面主体 */}
            <main className="w-full max-w-4xl flex-grow">{children}</main>

            {/* 底部信息 */}
            <footer className="w-full max-w-4xl mt-12 text-sm text-gray-500 dark:text-gray-400 text-center border-t pt-4">
              <p>
                &copy; {new Date().getFullYear()} Bruce Chen. All rights
                reserved.
              </p>
              <p className="mt-2">
                Email:&nbsp;
                <a
                  href="mailto:yc5508@nyu.edu"
                  className="underline hover:text-blue-600"
                >
                  yc5508@nyu.edu
                </a>
                &nbsp;|&nbsp; GitHub:&nbsp;
                <a
                  href="https://github.com/ChenYujunjks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  @ChenYujunjks
                </a>
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
