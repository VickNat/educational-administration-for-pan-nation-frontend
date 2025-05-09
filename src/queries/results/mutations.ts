import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';

export const useCreateResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resultData: any) => fetchWithAuth('/result', { method: 'POST', body: JSON.stringify(resultData) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });
};

export const useDeleteResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resultId: string) => fetchWithAuth(`/result/${resultId}`, { method: 'DELETE' }),
  });
};
