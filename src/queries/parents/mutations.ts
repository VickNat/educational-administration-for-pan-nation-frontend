import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';

export function useAddParent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchWithAuth('/parent', { method: 'POST', body: JSON.stringify(data) }),
  });
}

export function useUpdateParent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => {
      console.log("Data", data)
      return fetchWithAuth(`/parent/${id}`, { method: 'POST', body: JSON.stringify(data) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
    },
  });
}

export function useDeleteParent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetchWithAuth(`/parent/${id}`, { method: 'DELETE' }),
  });
}

