import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membersApi } from '../../../api/members.api';
import type { CreateMemberRequest, UpdateMemberRequest } from '../../../types/member.types';

export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: membersApi.getAll,
  });
}

export function useMember(id: number) {
  return useQuery({
    queryKey: ['members', id],
    queryFn: () => membersApi.getById(id),
    enabled: id > 0,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMemberRequest) => membersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMemberRequest }) =>
      membersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => membersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
}