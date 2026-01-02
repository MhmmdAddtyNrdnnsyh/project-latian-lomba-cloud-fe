"use client";

import { api } from "@/lib/axios";
import { useCallback, useState } from "react";

export const useFetchById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null);

  const fetchDataId = useCallback(async (id) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/api/student/${id}`);
      const data = res.data;
      setStudent(data);
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

  return { fetchDataId, fetchIdLoading: loading, fetchIdError: error, student };
};
