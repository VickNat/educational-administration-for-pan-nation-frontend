import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

export const useCreateCalendarEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: any) => {
      console.log("inside mutation");
      console.log("inside mutation",user);
      if (user?.user?.role !== 'DIRECTOR') {
        throw new Error('Only directors can create calendar events');
      }
      return fetchWithAuth('/calendar', { method: 'POST', body: JSON.stringify(data) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
};

export const useUpdateCalendarEvent = (id: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: any) => {
      if (user?.user?.role !== 'DIRECTOR') {
        throw new Error('Only directors can update calendar events');
      }
      return fetchWithAuth(`/calendar/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
};

export const useDeleteCalendarEvent = (id: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: () => {
      if (user?.user?.role !== 'DIRECTOR') {
        throw new Error('Only directors can delete calendar events');
      }
      return fetchWithAuth(`/calendar/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
};

