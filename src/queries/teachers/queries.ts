import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

export const useGetTeachers = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['teachers'],
    queryFn: () => fetchWithAuth('/teacher') as Promise<any>,
  });
};

export const useGetTeacherById = (id: string) => {
  return useQuery({
    queryKey: ['teachers', id],
    queryFn: () => fetchWithAuth(`/teacher/${id}`) as Promise<any>,
  });
};

export const useGetAvailableHomeRoomTeachers = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['teachers'],
    queryFn: () => fetchWithAuth('/teacher/available-homeroom') as Promise<any>,
    enabled: user?.user.role === 'DIRECTOR',
  });
};
