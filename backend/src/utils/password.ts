import * as argon2 from 'argon2';

const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
};

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

export async function hashToken(token: string): Promise<string> {
  return argon2.hash(token, { ...ARGON2_OPTIONS, timeCost: 2 });
}

export async function verifyTokenHash(hash: string, token: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, token);
  } catch {
    return false;
  }
}
