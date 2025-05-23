import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

export const useGetTodayAttendance = (sectionId: string) => {
  return useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      if (!sectionId) return null;
      const response = await fetchWithAuth(`/attendance/today/${sectionId}`);
      return response as Promise<any>;
    },
    enabled: !!sectionId
  });
}

export const useGetAttendanceHistory = (studentId: string) => {
  return useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      if (!studentId) return null;
      const response = await fetchWithAuth(`/attendance/student/${studentId}`);
      return response as Promise<any>;
    },
    enabled: !!studentId
  });
}