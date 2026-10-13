import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server';
import { getStore } from './store.server';

const COOKIE = 'bracon_session';
const enc = new TextEncoder();
const hex = (b: ArrayBuffer | Uint8Array) => Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
const unhex = (s: string) => new Uint8Array(s.match(/../g)!.map((h) => parseInt(h, 16)));

export async function sha256(v: string) { return hex(await crypto.subtle.digest('SHA-256', enc.encode(v))); }

async function pbkdf2(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: salt as BufferSource, iterations }, key, 256));
}
export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16)); const it = 100000;
  return `pbkdf2$${it}$${hex(salt)}$${await pbkdf2(password, salt, it)}`;
}
export async function verifyPassword(password: string, stored: string) {
  const [, it, salt, hash] = stored.split('$');
  if (!it || !salt || !hash) return false;
  const got = await pbkdf2(password, unhex(salt), Number(it));
  let diff = got.length ^ hash.length; for (let i = 0; i < Math.min(got.length, hash.length); i++) diff |= got.charCodeAt(i) ^ hash.charCodeAt(i);
  return diff === 0;
}

export async function startSession(userId: string) {
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  const expires = new Date(Date.now() + 14 * 86400_000);
  await (await getStore()).createSession(await sha256(token), userId, expires);
  setCookie(COOKIE, token, { httpOnly: true, secure: process.env['NODE_ENV'] !== 'development', sameSite: 'lax', path: '/', expires });
}
export async function endSession() {
  const token = getCookie(COOKIE);
  if (token) await (await getStore()).deleteSession(await sha256(token));
  deleteCookie(COOKIE, { path: '/' });
}
export async function currentUser() {
  const token = getCookie(COOKIE);
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  return (await getStore()).findSessionUser(await sha256(token));
}
export async function requireStaff() {
  const u = await currentUser();
  if (!u) throw new Error('Please sign in again.');
  if (u.role === 'pending') throw new Error('Your account is waiting for administrator approval.');
  return u;
}
