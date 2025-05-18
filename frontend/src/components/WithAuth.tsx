// components/withAuth.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ComponentType, JSX } from "react";

// ✅ 添加类型限制
export default function WithAuth<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");
      // Check if the token exists in local storage
      console.log("No token found, redirecting to login");
      if (!token) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    }, [router]);

    if (!isAuthenticated) return null;

    return <WrappedComponent {...props} />;
  };
}
