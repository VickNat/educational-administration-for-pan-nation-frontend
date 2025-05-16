import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

// Director related users
export const useGetDirectorRelatedUsers = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['directorRelatedUsers'],
    queryFn: () => fetchWithAuth(`/director/related-users`) as Promise<any>,
    enabled: user?.user?.role === 'DIRECTOR',
  });
};

// Parent related users
export const useGetParentRelatedUsers = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['parentRelatedUsers'],
    queryFn: () => fetchWithAuth(`/parent/${user?.roleId}/related-users`) as Promise<any>,
    enabled: user?.user?.role === 'PARENT',
  });
};

// Teacher related users
export const useGetTeacherRelatedUsers = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['teacherRelatedUsers'],
    queryFn: () => fetchWithAuth(`/teacher/${user?.roleId}/related-users`) as Promise<any>,
    enabled: user?.user?.role === 'TEACHER',
  });
};

// Get messages between users
export const useGetMessagesBetweenUsers = (senderId: string, receiverId: string) => {
  return useQuery({
    queryKey: ['messagesBetweenUsers', senderId, receiverId],
    queryFn: () =>
      fetchWithAuth(`/message`, {
        method: 'POST',
        body: JSON.stringify({
          senderId,
          receiverId,
        }),
      }) as Promise<any>,
    enabled: !!senderId && !!receiverId,
  });
};
