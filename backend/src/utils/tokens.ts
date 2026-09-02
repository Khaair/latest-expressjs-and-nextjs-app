import { randomBytes } from 'crypto';

export function generateSecureToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex');
}

export function getRefreshTokenExpiry(duration: string): Date {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];
  const now = new Date();

  switch (unit) {
    case 's':
      now.setSeconds(now.getSeconds() + value);
      break;
    case 'm':
      now.setMinutes(now.getMinutes() + value);
      break;
    case 'h':
      now.setHours(now.getHours() + value);
      break;
    case 'd':
      now.setDate(now.getDate() + value);
      break;
    default:
      throw new Error(`Unsupported duration unit: ${unit}`);
  }

  return now;
}
