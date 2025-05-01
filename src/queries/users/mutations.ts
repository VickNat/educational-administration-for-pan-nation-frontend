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