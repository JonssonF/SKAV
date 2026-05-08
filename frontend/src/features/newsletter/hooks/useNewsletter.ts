import { useMutation } from '@tanstack/react-query';
import { newsletterApi } from '../../../api/newsletter.api';
import type { SendNewsletterRequest } from '../../../types/newsletter.types';

export function useSendNewsletter() {
  return useMutation({
    mutationFn: (data: SendNewsletterRequest) => newsletterApi.send(data),
  });
}