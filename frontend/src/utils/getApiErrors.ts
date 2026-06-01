import { AxiosError } from 'axios';
import type { ApiError } from '../types/api-error.types';

export function getApiErrors(err: unknown): Record<string, string> | null {
  if (!(err instanceof AxiosError)) return null;

  const data = err.response?.data as ApiError | undefined;
  if (!data?.errors) return null;

  // Konvertera { "Date": ["Fel 1", "Fel 2"] } till { "date": "Fel 1" }
  // Gör första bokstaven liten så det matchar våra frontend-fältnamn
  const result: Record<string, string> = {};
  for (const [key, messages] of Object.entries(data.errors)) {
    const frontendKey = key.charAt(0).toLowerCase() + key.slice(1);
    result[frontendKey] = messages[0];
  }

  return result;
}

export function getApiMessage(err: unknown): string {
  if (!(err instanceof AxiosError)) return 'Något gick fel.';

  const status = err.response?.status;
  if (status === 401) return 'Du är inte inloggad.';
  if (status === 403) return 'Du har inte behörighet.';

  const data = err.response?.data as ApiError | undefined;
  return data?.message ?? 'Något gick fel.';
}

export function getApiStatus(err: unknown): number | null {
  if (!(err instanceof AxiosError)) return null;
  return err.response?.status ?? null;
}