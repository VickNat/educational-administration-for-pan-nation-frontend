import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

export const useGetCalendarEvents = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['calendar'],
    queryFn: () => fetchWithAuth('/calendar') as Promise<any>,
    enabled: !!user,
  }); 
};

export const useGetCalendarEventById = (id: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['calendar', id],
    queryFn: () => fetchWithAuth(`/calendar/${id}`) as Promise<any>,
    enabled: !!user,
  });
};

