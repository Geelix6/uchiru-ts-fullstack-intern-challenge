import { createHmac } from 'crypto';

export function generateToken(userId: string): string {
  const secret = process.env.HMAC_SECRET;
  const salt = process.env.HMAC_SALT;

  return createHmac('sha256', secret)
    .update(userId + salt)
    .digest('hex');
}
