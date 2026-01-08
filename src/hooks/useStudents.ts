import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentService } from "@/services/StudentService";
import { StudentFormType, StudentType } from "@/types/StudentType";

type UpdatePayload = {
  id: string;
  payload: StudentFormType;
};

const STUDENTS_QUERY_KEY = ["students"];

export const useStudents = () => {
  const queryClient = useQueryClient();

  const studentsQuery = useQuery<StudentType[]>({
    queryKey: STUDENTS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await StudentService.getAll();
      return data;
    },
  });

  const createStudent = useMutation({
    mutationFn: async (payload: StudentFormType) => {
      const { data } = await StudentService.create(payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
    },
  });

  const updateStudent = useMutation({
    mutationFn: async ({ id, payload }: UpdatePayload) => {
      const { data } = await StudentService.update(id, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["student", variables.id] });
    },
  });

  const deleteStudent = useMutation({
    mutationFn: async (id: string) => {
      await StudentService.remove(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["student", id] });
    },
  });

  return {
    students: studentsQuery.data ?? [],
    isLoading: studentsQuery.isLoading,
    isError: studentsQuery.isError,
    error: studentsQuery.error,
    refetch: studentsQuery.refetch,
    createStudent,
    updateStudent,
    deleteStudent,
  };
};
