import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

export const useGetStudentById = (id: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => fetchWithAuth(`/student/${id}`) as Promise<any>,
    enabled: !!user,
  });
};

export const useGetStudents = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['students'],
    queryFn: () => fetchWithAuth('/student') as Promise<any>,
    enabled: !!user,
  });
};

export const useGetUnassignedStudents = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['students'],
    queryFn: () => fetchWithAuth('/student/unassigned') as Promise<any>,
    enabled: !!user,
  });
};
