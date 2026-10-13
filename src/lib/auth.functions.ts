import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import { z } from 'zod';

const creds = z.object({ email: z.string().trim().toLowerCase().email().max(255), password: z.string().min(8).max(200) });

export const getMe = createServerFn({ method: 'GET' }).handler(async () => {
  const { currentUser } = await import('./auth.server');
  return currentUser();
});

export const signIn = createServerFn({ method: 'POST' }).inputValidator((i) => creds.parse(i)).handler(async ({ data }) => {
  const { getStore } = await import('./store.server');
  const { verifyPassword, startSession, sha256 } = await import('./auth.server');
  const store = await getStore();
  const ip = getRequestHeader('cf-connecting-ip') || getRequestHeader('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (!(await store.rateLimit(`signin:${await sha256(ip)}`, 10, 900))) throw new Error('Too many attempts. Please wait 15 minutes.');
  const user = await store.findUserByEmail(data.email);
  if (!user || !(await verifyPassword(data.password, user.password_hash))) throw new Error('Incorrect email or password.');
  await startSession(user.id);
  return { role: user.role };
});

export const signUp = createServerFn({ method: 'POST' }).inputValidator((i) => creds.parse(i)).handler(async ({ data }) => {
  const { getStore } = await import('./store.server');
  const { hashPassword, startSession, sha256 } = await import('./auth.server');
  const store = await getStore();
  const ip = getRequestHeader('cf-connecting-ip') || getRequestHeader('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (!(await store.rateLimit(`signup:${await sha256(ip)}`, 5, 3600))) throw new Error('Too many attempts. Please try later.');
  if (await store.findUserByEmail(data.email)) throw new Error('An account with this email already exists. Please sign in.');
  // The very first account becomes the administrator; later accounts wait for approval.
  const role = (await store.countUsers()) === 0 ? 'admin' : 'pending';
  await store.createUser(data.email, await hashPassword(data.password), role);
  const user = await store.findUserByEmail(data.email);
  if (user) await startSession(user.id);
  return { role };
});

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  const { endSession } = await import('./auth.server');
  await endSession();
  return { success: true };
});
