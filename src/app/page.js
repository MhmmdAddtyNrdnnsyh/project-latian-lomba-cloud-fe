"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCreate } from "@/hooks/useCreate";
import { useDelete } from "@/hooks/useDelete";
import { useFetch as useFetchList } from "@/hooks/useFetch";
import { useFetchById } from "@/hooks/useFetchById";
import { useUpdate } from "@/hooks/useUpdate";
import { SchemaStudent } from "@/validators/StudentValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, RefreshCcw, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

const Home = () => {
  const {
    handleSubmit,
    reset,
    control,
    setError,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(SchemaStudent),
    defaultValues: {
      name: "",
      studentClass: "",
      school: "",
      email: "",
      nis: "",
      nisn: "",
      phoneNumber: "",
      foto: null,
    },
  });
  const { fetchData, fetchError, fetchLoading, students } = useFetchList();
  const { fetchDataId, fetchIdLoading, fetchIdError, student } = useFetchById();
  const { createData, createError } = useCreate();
  const { updateData, updateError } = useUpdate();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [editTarget, setEditTarget] = useState(null);
  const isEditMode = mode === "edit";
  const submitError = isEditMode ? updateError : createError;
  const { deleteData, deleteError, deleteLoading } = useDelete();

  const handleOpenCreate = () => {
    setMode("create");
    setEditTarget(null);
    reset();
    setOpen(true);
  };

  const handleEdit = async (id) => {
    setMode("edit");
    setEditTarget(id);
    setOpen(true);
    await fetchDataId(id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteData(id);
      fetchData();
      return toast.success("Data Berhasil dihapus");
    } catch (error) {
      return toast.error("Data gagal dihapus");
    }
  };

  const onSubmit = async (data) => {
    const isEditing = isEditMode && editTarget;

    if (!isEditing && !data.foto) {
      setError("foto", { type: "manual", message: "Foto wajib diisi" });
      return;
    }

    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("studentClass", data.studentClass);
    fd.append("school", data.school);
    fd.append("email", data.email);
    fd.append("nis", data.nis);
    fd.append("nisn", data.nisn);
    fd.append("phoneNumber", data.phoneNumber);
    if (data.foto instanceof File) {
      fd.append("foto", data.foto);
    }

    const success = isEditing
      ? await updateData(editTarget, fd)
      : await createData(fd);

    if (success) {
      reset();
      setMode("create");
      setEditTarget(null);
      fetchData();
      setOpen(false);
      toast.success("Berhasil menambahkan data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (isEditMode && student && student.id === editTarget) {
      reset({
        name: student.name ?? "",
        studentClass: student.studentClass ?? "",
        school: student.school ?? "",
        email: student.email ?? "",
        nis: student.nis ?? "",
        nisn: student.nisn ?? "",
        phoneNumber: student.phoneNumber ?? "",
        foto: null,
      });
    }
  }, [isEditMode, student, editTarget, reset]);

  return (
    <main className="min-h-screen py-10 px-15">
      <header>
        <h1 className="text-3xl text-gray-900 font-bold">Data Siswa SMEKAR</h1>
        <p className="text-sm text-slate-600 mt-2">
          Berbagai data siswa SMK Negeri 1 Dukuhturi, dibuat dengan backend NEST
          JS
        </p>
      </header>
      <section className="mt-15">
        <div className="flex justify-between items-center">
          <Input
            className={`py-1 px-2`}
            type={"text"}
            placeholder="Cari disini..."
          />
          <div className="flex justify-center items-center gap-2">
            <Button
              className={`py-1 px-2`}
              onClick={fetchData}
              disabled={fetchLoading}
            >
              <RefreshCcw />
              Refresh
            </Button>
            <Dialog
              open={open}
              onOpenChange={(next) => {
                setOpen(next);
                if (!next) {
                  setMode("create");
                  setEditTarget(null);
                  reset();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className={`py-1 px-2`} onClick={handleOpenCreate}>
                  <Plus size={10} />
                  Tambah
                </Button>
              </DialogTrigger>
              <DialogContent
                className={`max-h-3/4 overflow-hidden overflow-y-auto`}
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditMode ? "Edit Data Siswa" : "Tambah Data"}
                    </DialogTitle>
                    <DialogDescription>
                      {isEditMode
                        ? "Perbarui data siswa yang dipilih."
                        : "Tambahkan sebuah data jika terdapat data yang belum ditambahkan."}
                    </DialogDescription>
                  </DialogHeader>
                  {isEditMode && fetchIdLoading && (
                    <div className="flex items-center gap-2 rounded-md border border-dashed border-slate-200/70 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      <Spinner className="size-4" />
                      Memuat data siswa...
                    </div>
                  )}
                  {isEditMode && fetchIdError && (
                    <p className="text-sm text-destructive">{fetchIdError}</p>
                  )}
                  <FieldGroup className={`mt-6`}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Nama</FieldLabel>
                          <Input type={`text`} {...field} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="studentClass"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Kelas</FieldLabel>
                          <Input type={`text`} {...field} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="school"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Sekolah</FieldLabel>
                          <Input type={`text`} {...field} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="email"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Email</FieldLabel>
                          <Input type={`text`} {...field} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <div className="flex gap-2">
                      <Controller
                        name="nis"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>NIS</FieldLabel>
                            <Input type={`text`} {...field} />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="nisn"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>NISN</FieldLabel>
                            <Input type={`text`} {...field} />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>
                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Telepon</FieldLabel>
                          <Input type={`text`} {...field} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="foto"
                      control={control}
                      defaultValue={null}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Foto</FieldLabel>
                          <Input
                            type={`file`}
                            accept="image/*"
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                  {submitError && (
                    <p className="mt-3 text-sm text-destructive">
                      {submitError}
                    </p>
                  )}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className={`mt-5`}
                      disabled={isSubmitting || (isEditMode && fetchIdLoading)}
                    >
                      {isSubmitting
                        ? "Menyimpan..."
                        : isEditMode
                        ? "Update"
                        : "Submit"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Table className={`mt-7`}>
          <TableHeader className={`bg-accent rounded-t-2xl`}>
            <TableRow>
              <TableHead className={`font-bold`}>No</TableHead>
              <TableHead className={`font-bold`}>Nama</TableHead>
              <TableHead className={`font-bold`}>Kelas</TableHead>
              <TableHead className={`font-bold`}>Sekolah</TableHead>
              <TableHead className={`font-bold`}>Email</TableHead>
              <TableHead className={`font-bold`}>Telepon</TableHead>
              <TableHead className={`font-bold`}>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchLoading && (
              <TableRow className={`hover:bg-transparent`}>
                <TableCell colSpan={7} className={`text-center py-6`}>
                  <div className="flex justify-center items-center gap-2">
                    <Spinner />
                    <span>Memuat data...</span>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!fetchLoading && fetchError && (
              <TableRow className={`hover:bg-transparent`}>
                <TableCell
                  colSpan={7}
                  className={`text-center text-destructive py-6`}
                >
                  {fetchError}
                </TableCell>
              </TableRow>
            )}

            {!fetchLoading && !fetchError && students.length === 0 && (
              <TableRow className={`hover:bg-transparent`}>
                <TableCell colSpan={7} className={`text-center py-6`}>
                  Data belum ditambahkan!
                </TableCell>
              </TableRow>
            )}

            {!fetchLoading &&
              !fetchError &&
              students.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell
                    className={`flex justify-start items-center gap-2`}
                  >
                    <Avatar className={`w-10 h-10`}>
                      <AvatarImage
                        className={`object-cover`}
                        src={student.fotoUrl}
                      />
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold">
                        {student.name}
                      </span>
                      <div className="text-xs text-slate-600 flex justify-start items-center gap-2">
                        <span>{student.nis}</span>
                        <span>-</span>
                        <span>{student.nisn}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.studentClass}</TableCell>
                  <TableCell>{student.school}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phoneNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="px-3 bg-green-300 hover:bg-green-200"
                        onClick={() => handleEdit(student.id)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            className={`bg-destructive hover:bg-destructive/50`}
                            disabled={deleteLoading}
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Yakin ingin menghapus data ini?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Jika yaa, data akan terhapus secara permanen, dan
                              tidak dapat dipulihkan
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              className={`bg-red-600 hover:bg-red-700`}
                              onClick={() => handleDelete(student.id)}
                            >
                              Ya, Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
};

export default Home;
