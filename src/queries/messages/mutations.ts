import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';

// Send message for all roles
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => {
      console.log('message data', data);
      return fetchWithAuth('/message', { method: 'POST', body: JSON.stringify(data) })
    },
    onError: (error) => {
      console.log('error', error);
    },  
  });
};

// Mark message as read
export const useMarkMessageAsRead = (messageId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetchWithAuth(`/message/${messageId}`, { method: 'PUT' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

// Delete message
export const useDeleteMessage = (messageId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetchWithAuth(`/message/${messageId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

