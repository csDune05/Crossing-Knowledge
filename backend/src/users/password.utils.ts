import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const HASH_SEPARATOR = ':';

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES).toString('hex');
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}${HASH_SEPARATOR}${derivedKey.toString('hex')}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [salt, hash] = storedHash.split(HASH_SEPARATOR);
  if (!salt || !hash || hash.length % 2 !== 0) {
    return false;
  }
  const derivedKey = (await scrypt(password, salt, hash.length / 2)) as Buffer;
  const storedKey = Buffer.from(hash, 'hex');
  return timingSafeEqual(storedKey, derivedKey);
}
