"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const pathname = window.location.pathname;
    // 如果没有 token 且不在登录或注册页面，则跳转到登录页
    if (!token && pathname !== "/login" && pathname !== "/register") {
      router.push("/login");
    }
  }, [router]);

  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
