import apiClient from './axios';
import type { SiteSettingResponse, UpdateSiteSettingRequest } from '../types/siteSetting.types';

export const siteSettingsApi = {
  getAll: async (): Promise<SiteSettingResponse[]> => {
    const { data } = await apiClient.get('/site-settings');
    return data;
  },

  update: async (request: UpdateSiteSettingRequest): Promise<void> => {
    await apiClient.put('/site-settings', request);
  },
};