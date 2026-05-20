import { http } from '@/app/api/http.ts';

export async function fetchFileBlob(key: string): Promise<string> {
  const response = await http.get(`/files/${key}`, { responseType: 'blob' });
  return URL.createObjectURL(response.data);
}
