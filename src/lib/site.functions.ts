import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import { z } from 'zod';
import { enquirySchema } from './schemas';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Not Interested', 'Closed'] as const;

export const getContent = createServerFn({ method: 'GET' }).handler(async () => {
  const { getStore } = await import('./store.server');
  try {
    return (await (await getStore()).listContent(true)).map(({ key, title, body, category }) => ({ key, title, body, category }));
  } catch { throw new Error('Website content is temporarily unavailable.'); }
});

export const submitEnquiry = createServerFn({ method: 'POST' }).inputValidator((input) => enquirySchema.parse(input)).handler(async ({ data }) => {
  const { getStore } = await import('./store.server');
  const { sha256 } = await import('./auth.server');
  const store = await getStore();
  const ip = getRequestHeader('cf-connecting-ip') || getRequestHeader('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (!(await store.rateLimit(`enquiry:${await sha256(ip)}`, 10, 3600))) throw new Error('Too many enquiries. Please contact us by email or phone.');
  const { website: _, ...row } = data;
  try { await store.insertEnquiry({ ...row, status: 'New' }); } catch { throw new Error('Your enquiry could not be saved. Please try again or contact sales@braconwire.com.'); }
  return { success: true };
});

export const getAdminData = createServerFn({ method: 'GET' }).handler(async () => {
  const { getStore } = await import('./store.server');
  const { currentUser } = await import('./auth.server');
  const me = await currentUser();
  if (!me) throw new Error('Please sign in again.');
  if (me.role === 'pending') return { allowed: false as const, me, leads: [], content: [], chats: [], users: [] };
  const store = await getStore();
  const [leads, content, chats, users] = await Promise.all([store.listEnquiries(), store.listContent(false), store.listChats(), me.role === 'admin' ? store.listUsers() : Promise.resolve([])]);
  return { allowed: true as const, me, leads, content, chats, users };
});

export const saveContent = createServerFn({ method: 'POST' }).inputValidator((input) => z.object({ key: z.string().min(1).max(100), title: z.string().min(1).max(300), body: z.string().max(30000), category: z.string().max(100), published: z.boolean() }).parse(input)).handler(async ({ data }) => {
  const { getStore } = await import('./store.server');
  const { requireStaff } = await import('./auth.server');
  await requireStaff();
  await (await getStore()).upsertContent(data);
  return { success: true };
});

export const updateLead = createServerFn({ method: 'POST' }).inputValidator((input) => z.object({ id: z.string().uuid(), status: z.enum(STATUSES), notes: z.string().max(5000) }).parse(input)).handler(async ({ data }) => {
  const { getStore } = await import('./store.server');
  const { requireStaff } = await import('./auth.server');
  await requireStaff();
  await (await getStore()).updateEnquiry(data.id, data.status, data.notes);
  return { success: true };
});

export const setStaffRole = createServerFn({ method: 'POST' }).inputValidator((input) => z.object({ id: z.string().uuid(), role: z.enum(['staff', 'pending', 'admin']) }).parse(input)).handler(async ({ data }) => {
  const { getStore } = await import('./store.server');
  const { requireStaff } = await import('./auth.server');
  const me = await requireStaff();
  if (me.role !== 'admin') throw new Error('Only administrators can change staff access.');
  if (me.id === data.id) throw new Error('You cannot change your own access.');
  await (await getStore()).setUserRole(data.id, data.role);
  return { success: true };
});
