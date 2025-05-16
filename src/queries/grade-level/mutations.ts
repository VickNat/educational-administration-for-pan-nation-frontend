import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';

export const useCreateGradeLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchWithAuth('/gradeLevel', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grade-levels'] });
    },
  });
};

export const useUpdateGradeLevel = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchWithAuth(`/gradeLevel/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grade-levels'] });
    },
  });
};

export const useDeleteGradeLevel = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetchWithAuth(`/gradeLevel/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grade-levels'] });
    },
  });
};

export const useCreateGradeLevelMessage = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchWithAuth(`/grade-level-message`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grade-level-messages'] });
    },
  });
};

export const useDeleteGradeLevelMessage = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetchWithAuth(`/grade-level-message/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grade-level-messages'] });
    },
  });
};

