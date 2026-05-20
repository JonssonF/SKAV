import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { songProposalsApi } from '../../../api/songProposals.api';
import type {
  CreateSongProposalRequest,
  UpdateSongProposalRequest,
} from '../../../types/songProposal.types';

export function useSongProposals() {
  return useQuery({
    queryKey: ['songProposals'],
    queryFn: songProposalsApi.getAll,
  });
}

export function useCreateSongProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSongProposalRequest) => songProposalsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songProposals'] });
    },
  });
}

export function useUpdateSongProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSongProposalRequest }) =>
      songProposalsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songProposals'] });
    },
  });
}

export function useDeleteSongProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => songProposalsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songProposals'] });
    },
  });
}

export function useVoteSongProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => songProposalsApi.vote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songProposals'] });
    },
  });
}

export function useSetWinner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => songProposalsApi.setWinner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songProposals'] });
    },
  });
}

export function useResetVotes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => songProposalsApi.resetVotes(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songProposals'] });
    },
  });
}