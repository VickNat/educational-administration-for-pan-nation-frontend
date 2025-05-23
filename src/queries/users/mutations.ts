import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { UpdateUserInput, User } from '@/lib/utils/types';

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input }: { input: UpdateUserInput }) =>
      fetchWithAuth<User>(`/users/update-me`, {
        method: 'PUT',
        body: JSON.stringify(input),
      }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export const useActivateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input }: { input: any }) =>
      fetchWithAuth(`/teacher/activate`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: (updatedTeacher) => {
      queryClient.setQueryData(['teachers'], updatedTeacher);
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
}

export const useActivateParent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input }: { input: any }) =>
      fetchWithAuth(`/parent/activate`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: (updatedParent) => {
      queryClient.setQueryData(['parents'], updatedParent);
      queryClient.invalidateQueries({ queryKey: ['parents', 'user'] });
    },
  });
}
