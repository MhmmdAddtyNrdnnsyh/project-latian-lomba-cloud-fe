"use client";

import { api } from "@/lib/axios";
import { useState } from "react";

export const useCreate = () => {
  const [error, setError] = useState("");

  const createData = async (payload) => {
    try {
      setError("");
      await api.post("/api/student", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan saat membuat data"
      );
      return false;
    }
  };

  return {
    createData,
    createError: error,
  };
};
