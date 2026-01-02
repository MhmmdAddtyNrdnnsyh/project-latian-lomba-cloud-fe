import { z } from "zod";

export const SchemaStudent = z.object({
  name: z
    .string()
    .min(1, "Nama Wajib Diisi")
    .min(8, "Nama minimal 8 karakter")
    .max(30, "Nama maksimal 30 karakter"),
  studentClass: z
    .string()
    .min(1, "Kelas wajib diisi")
    .min(4, "Kelas minimal 2 karakter")
    .max(10, "Kelas maksimal 6 karakter"),
  school: z
    .string()
    .min(1, "Sekolah wajib diisi")
    .min(8, "Sekolah minimal 8 karakter")
    .max(30, "Sekolah maksimal 30 karakter"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  nis: z
    .string()
    .regex(/^\d+$/, "NIS hanya angka yang diperbolehkan")
    .min(1, "NIS wajib diisi")
    .min(5, "NIS minimal 5 angka")
    .max(5, "NIS maksimal 5 angka"),
  nisn: z
    .string()
    .regex(/^\d+$/, "NISN hanya angka yang diperbolehkan")
    .min(1, "NISN wajib diisi")
    .min(10, "NISN minimal 10 angka")
    .max(10, "NISN maksimal 10 angka"),
  phoneNumber: z
    .string()
    .regex(/^\d+$/, "Telepon hanya angka yang diperbolehkan")
    .min(1, "Telepon wajib diisi")
    .min(10, "Telepon minimal 10 angka")
    .max(16, "Telepon maksimal 16 angka"),
  foto: z
    .instanceof(File, { message: "Foto wajib diisi" })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "Ukuran maksimal 10MB",
    })
    .refine(
      (file) => file.type?.startsWith("image/"),
      {
        message: "Hanya image yang diperbolehkan",
      }
    )
    .optional()
    .nullable(),
});
