import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

export const useGetAnnouncements = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['announcements'],
    queryFn: () => fetchWithAuth('/announcement') as Promise<any>,
    enabled: !!user && user.user.role === 'DIRECTOR',
  });
}

export const useGetAnnouncementById = (id: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['announcements', id],
    queryFn: () => fetchWithAuth(`/announcement/${id}`) as Promise<any>,
    enabled: !!user && user.user.role === 'DIRECTOR',
  });
}
