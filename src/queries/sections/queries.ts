import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

export const useGetSections = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['sections'],
    queryFn: () => fetchWithAuth('/section/role') as Promise<any>,
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

export const useGetSectionMessages = (sectionId: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['section-messages', sectionId],
    queryFn: () => fetchWithAuth(`/section-message/section/${sectionId}`) as Promise<any>,
    enabled: !!user,
    
  });
};
