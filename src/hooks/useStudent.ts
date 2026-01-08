import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StudentService } from "@/services/StudentService";
import { StudentFormType, StudentType } from "@/types/StudentType";

export const useStudent = (id?: string) => {
  const queryClient = useQueryClient();

  const studentQuery = useQuery<StudentType>({
    queryKey: ["student", id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) {
        throw new Error("Student id belum ada");
      }
      const { data } = await StudentService.getById(id);
      return data;
    },
  });

  const updateStudent = useMutation({
    mutationFn: async (payload: StudentFormType) => {
      if (!id) {
        throw new Error("Student id belum ada");
      }
      const { data } = await StudentService.update(id, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", id] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const deleteStudent = useMutation({
    mutationFn: async () => {
      if (!id) {
        throw new Error("Student id belum ada");
      }
      await StudentService.remove(id);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["student", id] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  return {
    student: studentQuery.data ?? null,
    isLoading: studentQuery.isLoading,
    isError: studentQuery.isError,
    error: studentQuery.error,
    refetch: studentQuery.refetch,
    updateStudent,
    deleteStudent,
  };
};
