import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';

export const useAddTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchWithAuth('/teacher', { method: 'POST', body: JSON.stringify(data) }),
  });
};

export const useUpdateTeacher = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchWithAuth(`/users/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  });
};

export const useDeleteTeacher = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetchWithAuth(`/teacher/${id}`, { method: 'DELETE' }),
  });
};

