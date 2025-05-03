import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

export const useGetSections = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['sections'],
    queryFn: () => fetchWithAuth('/section') as Promise<any>,
    enabled: !!user,
  });
};

export const useGetSectionById = (id: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['sections', id],
    queryFn: () => fetchWithAuth(`/section/${id}`) as Promise<any>,
    enabled: !!user,
  });
};


