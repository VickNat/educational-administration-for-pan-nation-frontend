import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

export const useGetParents = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['parents'],
    queryFn: () => {
      return fetchWithAuth('/parent') as Promise<any>;
    },
    enabled: !!user && (user.role === 'TEACHER' || user.role === 'DIRECTOR'),
  });
};

export const useGetParentById = (id: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['parent', id],
    queryFn: () => fetchWithAuth(`/parent/${id}`) as Promise<any>,
    enabled: !!user && (user.role === 'TEACHER' || user.role === 'DIRECTOR'),
  });
};
