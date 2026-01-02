"use client";

import { api } from "@/lib/axios";
import { useState } from "react";

export const useDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteData = async (id) => {
    try {
      setLoading(true);
      setError("");
      await api.delete(`/api/student/${id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan saat mengambil data"
      );
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, deleteLoading: loading, deleteError: error };
};
