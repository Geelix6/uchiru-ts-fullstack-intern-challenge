import { CatDto } from '@/dto/CatDto';

const BASE_CAT_API_URL = 'https://api.thecatapi.com/v1';

export async function fetchCats(limit = 30): Promise<CatDto[]> {
  const res = await fetch(`${BASE_CAT_API_URL}/images/search?limit=${limit}`, {
    headers: {
      'x-api-key': import.meta.env.VITE_CAT_API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`Cats API error: ${res.status}`);
  }
  return await res.json();
}
