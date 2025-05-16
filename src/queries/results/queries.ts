import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

export const useGetSingleStudentResult = (studentId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['results', studentId],
    queryFn: () => {
      return fetchWithAuth(`/result/student/${studentId}`) as Promise<any>;
    },
    enabled: !!user && (user.user.role === 'TEACHER' || user.user.role === 'DIRECTOR'),
  });
};

export const useGetCollectiveResults = (studentId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['results', studentId],
    queryFn: () => {
      return fetchWithAuth(`/collective-result/${studentId}`) as Promise<any>;
    },
    enabled: !!user && (user.user.role === 'TEACHER' || user.user.role === 'DIRECTOR'),
  });
};

export const useGetResultById = (resultId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['results', resultId],
    queryFn: () => {
      return fetchWithAuth(`/result/${resultId}`) as Promise<any>;
    },
    enabled: !!user && (user.user.role === 'TEACHER' || user.user.role === 'DIRECTOR'),
  });
};

export const useGetCollectiveResultBySectionId = (sectionId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['results', sectionId],
    queryFn: () => {
      return fetchWithAuth(`/collective-result/section/${sectionId}`) as Promise<any>;
    },
    enabled: !!user && (user.user.role === 'TEACHER' || user.user.role === 'DIRECTOR'),
  });
};

export const useGetCollectiveResultByStudentId = (studentId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['results', studentId],
    queryFn: () => {
      return fetchWithAuth(`/collective-result/student/${studentId}`) as Promise<any>;
    },
    enabled: !!user,
  });
};
