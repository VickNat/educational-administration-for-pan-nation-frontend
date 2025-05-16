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

export const useGenerateCollectiveResult = () => {
  return useMutation({
    mutationFn: (sectionId: string) => fetchWithAuth(`/collective-result/section/${sectionId}`, { method: 'POST' }),
  });
};

export const useUpdateCollectiveResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectiveResultId, collectiveResultData }: { collectiveResultId: string; collectiveResultData: any }) => 
      fetchWithAuth(`/collective-result/${collectiveResultId}`, { method: 'PUT', body: JSON.stringify(collectiveResultData) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });
};

