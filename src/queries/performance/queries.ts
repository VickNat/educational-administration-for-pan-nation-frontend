import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

export const useGetStudentPerformance = (studentId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['student-performance', studentId],
    queryFn: () => fetchWithAuth(`/roster/student/${studentId}`) as Promise<any>,
    enabled: !!user,
  });
};
