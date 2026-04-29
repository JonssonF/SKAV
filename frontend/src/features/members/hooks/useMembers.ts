import { useQuery } from '@tanstack/react-query';
import { membersApi } from '../../../api/members.api';

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