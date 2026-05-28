import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siteSettingsApi } from '../../../api/siteSettings.api';
import type { UpdateSiteSettingRequest } from '../../../types/siteSetting.types';

export function useSiteSettings() {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: siteSettingsApi.getAll,
  });
}

export function useUpdateSiteSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateSiteSettingRequest) => siteSettingsApi.update(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
    },
  });
}