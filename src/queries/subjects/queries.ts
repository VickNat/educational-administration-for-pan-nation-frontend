import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

export const useGetSubjects = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['subjects'],
    queryFn: () => fetchWithAuth('/subject') as Promise<any>,
    enabled: !!user,
  });
}

export const useGetSubjectById = (id: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['subjects', id],
    queryFn: () => fetchWithAuth(`/subject/${id}`) as Promise<any>,
    enabled: !!user,
  });
}