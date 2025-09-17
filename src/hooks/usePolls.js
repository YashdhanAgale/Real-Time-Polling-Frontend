import { useState, useEffect } from "react";
import api from "../services/api";

export default function usePolls(activeTab) {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = activeTab === "all" ? "/poll" : "/poll/me";
      const res = await api.get(endpoint);

      setPolls(res.data);
    } catch (err) {
      setError(err.message + "Failed to load polls. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [activeTab]);

  return { polls, loading, error, fetchPolls };
}
