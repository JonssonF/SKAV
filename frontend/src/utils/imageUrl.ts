export const IMAGE_BASE_URL = 'http://localhost:5249';

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return 'https://placehold.co/400x400?text=Ingen+bild';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}${path}`;
}