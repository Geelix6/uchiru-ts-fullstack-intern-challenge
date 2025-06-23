import { ErrorResponse } from '@/dto/ErrorResponseDto';
import { LikeRequestDto } from '@/dto/LikeRequestDto';
import { LikeResponseDto } from '@/dto/LikeResponseDto';
import { UserDto } from '@/dto/UserDto';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function newUser(login: string, password: string): Promise<string> {
  const userData: UserDto = { login, password };
  const res = await fetch(`${API_BASE}/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err: ErrorResponse = await res.json();
    throw err;
  }

  const token = res.headers.get('X-Auth-Token');
  if (!token) {
    throw new Error('Missing X-Auth-Token in response');
  }
  return token;
}

export async function listLikes(token: string): Promise<LikeResponseDto[]> {
  const res = await fetch(`${API_BASE}/likes`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err: ErrorResponse = await res.json();
    throw err;
  }

  const likesData = (await res.json()) as { data: LikeResponseDto[] };
  return likesData.data;
}

export async function addLike(token: string, like: LikeRequestDto): Promise<LikeResponseDto> {
  const res = await fetch(`${API_BASE}/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(like),
  });

  if (!res.ok) {
    const err: ErrorResponse = await res.json();
    throw err;
  }

  return (await res.json()) as LikeResponseDto;
}

export async function dropLike(token: string, cat_id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/likes/${cat_id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err: ErrorResponse = await res.json();
    throw err;
  }
}
