import { useState, useEffect } from "react";

export function useAllPlayers() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/players", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAllPlayers(data);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return { allPlayers, loading };
}
