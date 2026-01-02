"use client";

import { api } from "@/lib/axios";
import { useCallback, useState } from "react";

export const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const res = await api.get("/api/student");
      const data = res.data;
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan saat mengambil data"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchData, fetchLoading: loading, fetchError: error, students };
};
