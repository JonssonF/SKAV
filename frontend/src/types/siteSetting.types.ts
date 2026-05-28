export interface SiteSettingResponse {
  key: string;
  value: string;
  updatedAt: string | null;
  updatedByEmail: string | null;
}

export interface UpdateSiteSettingRequest {
  key: string;
  value: string;
}