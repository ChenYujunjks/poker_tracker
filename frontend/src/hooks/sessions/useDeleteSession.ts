// hooks/useDeleteSession.ts
import { useCallback } from "react";

export function useDeleteSession() {
  return {
    deleteSession: useCallback(async (id: number) => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/sessions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "删除失败");
      }
    }, []),
  };
}
