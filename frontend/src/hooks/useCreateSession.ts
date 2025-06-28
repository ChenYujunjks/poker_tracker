export function useCreateSession() {
  const createSession = async (date: Date) => {
    const token = localStorage.getItem("token");
    const formattedDate = date.toISOString().split("T")[0];
    const res = await fetch("http://localhost:8080/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ date: formattedDate }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "创建失败");
    }
    return await res.json();
  };

  return { createSession };
}
