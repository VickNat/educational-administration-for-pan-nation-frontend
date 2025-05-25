import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { UpdateUserInput, User, UserMe } from '@/lib/utils/types';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'react-hot-toast';

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input }: { input: UpdateUserInput }) =>
      fetchWithAuth<User>(`/users/update-me`, {
        method: 'PUT',
        body: JSON.stringify(input),
      }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<UserMe | undefined>(['user'], (oldData) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          user: {
            ...oldData.user,
            ...updatedUser,
          },
        };
      });
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

export const useForgotPassword = () => {
  const queryClient = useQueryClient();
  const user = useAuth();

  // if (!user || user?.user?.user.role !== 'DIRECTOR') {
  //   toast.error('User is not a director');
  //   return;
  // }

  return useMutation({
    mutationFn: (data: { userId: string, newPassword: string }) =>
      fetchWithAuth(`/director/forget-password`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
