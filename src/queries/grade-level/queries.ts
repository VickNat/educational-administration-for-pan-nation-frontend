import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

export const useGetGradeLevels = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['grade-levels'],
    queryFn: () => fetchWithAuth('/gradeLevel') as Promise<any>,
    enabled: !!user,
  });
};

export const useGetGradeLevelById = (id: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['grade-level', id],
    queryFn: () => fetchWithAuth(`/gradeLevel/${id}`) as Promise<any>,
    enabled: !!user,
  });
};

