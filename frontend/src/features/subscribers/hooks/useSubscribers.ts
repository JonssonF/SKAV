import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscribersApi } from '../../../api/subscribers.api';
import type { SubscriberRequest } from '../../../types/subscriber.types';

export function useSubscribers() {
  return useQuery({
    queryKey: ['subscribers'],
    queryFn: subscribersApi.getAll,
  });
}

export function useSubscribe() {
  return useMutation({
    mutationFn: (data: SubscriberRequest) => subscribersApi.subscribe(data),
  });
}

export function useUnsubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubscriberRequest) => subscribersApi.unsubscribe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
    },
  });
}