"use client";

import { api } from "@/lib/axios";
import { useState } from "react";

export const useUpdate = () => {
  const [error, setError] = useState("");

  const updateData = async (id, payload) => {
    try {
      setError("");
      await api.patch(`/api/student/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan saat memperbarui data"
      );
      return false;
    }
  };

  return {
    updateData,
    updateError: error,
  };
};
