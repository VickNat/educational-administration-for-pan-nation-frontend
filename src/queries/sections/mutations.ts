import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';

export const useAddSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchWithAuth('/section', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', 'grade-levels'] });
    },
  });
};

export const useAddStudentsToSection = (sectionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchWithAuth(`/section/addStudents/${sectionId}`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', 'grade-levels'] });
    },
  });
};

export const useRemoveStudentsFromSection = (sectionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchWithAuth(`/section/removeStudent/${sectionId}`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', 'grade-levels'] });
    },
  });
};

export const useUpdateSection = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchWithAuth(`/section/updateSection/${id}`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', 'grade-levels'] });
    },
  });
};

export const useDeleteSection = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetchWithAuth(`/section/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', 'grade-levels'] });
    },
  });
};

export const useCreateSectionMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchWithAuth(`/section-message`, { method: 'POST', body: JSON.stringify(data) }),
  });
};

export const useUpdateSectionMessage = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchWithAuth(`/section-message/${id}`, { method: 'POST', body: JSON.stringify(data) }),
  });
};

export const useDeleteSectionMessage = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetchWithAuth(`/section-message/${id}`, { method: 'DELETE' }),
  });
};

