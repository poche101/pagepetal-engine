// Storage layer. Uses your own MySQL database when DATABASE_URL is set (self-hosting),
// otherwise the Lovable Cloud database (preview). Access control lives in the callers.
/* eslint-disable @typescript-eslint/no-explicit-any */

export type Enquiry = { id: string; name: string; email: string; phone: string | null; company: string | null; product: string | null; message: string; kind: string; contact: string | null; location: string | null; preferred_contact: string | null; status: string; notes: string; created_at: string };
export type Content = { key: string; title: string; body: string; category: string; published: boolean; updated_at?: string };
export type Chat = { id: string; messages: any; created_at: string; updated_at: string };
export type AppUser = { id: string; email: string; password_hash: string; role: 'admin' | 'staff' | 'pending'; created_at: string };

export interface Store {
  insertEnquiry(row: Record<string, unknown>): Promise<void>;
  listEnquiries(): Promise<Enquiry[]>;
  updateEnquiry(id: string, status: string, notes: string): Promise<void>;
  listContent(publishedOnly: boolean): Promise<Content[]>;
  upsertContent(row: Content): Promise<void>;
  getChat(tokenHash: string): Promise<unknown[] | null>;
  saveChat(tokenHash: string, messages: unknown[]): Promise<void>;
  listChats(): Promise<Chat[]>;
  rateLimit(key: string, limit: number, seconds: number): Promise<boolean>;
  assistantBlock(): Promise<string | null>;
  setAssistantBlock(reason: string): Promise<void>;
  countUsers(): Promise<number>;
  findUserByEmail(email: string): Promise<AppUser | null>;
  createUser(email: string, hash: string, role: AppUser['role']): Promise<void>;
  listUsers(): Promise<Omit<AppUser, 'password_hash'>[]>;
  setUserRole(id: string, role: AppUser['role']): Promise<void>;
  createSession(tokenHash: string, userId: string, expires: Date): Promise<void>;
  findSessionUser(tokenHash: string): Promise<Omit<AppUser, 'password_hash'> | null>;
  deleteSession(tokenHash: string): Promise<void>;
}

let cached: Promise<Store> | undefined;
export function getStore(): Promise<Store> {
  if (!cached) cached = process.env['DATABASE_URL'] ? mysqlStore(process.env['DATABASE_URL']) : cloudStore();
  return cached;
}

const iso = (d: unknown) => (d instanceof Date ? d.toISOString() : String(d));

async function mysqlStore(url: string): Promise<Store> {
  const mysql = await import('mysql2/promise');
  const pool = mysql.createPool({ uri: url, connectionLimit: 5, timezone: 'Z', dateStrings: false });
  const q = async (sql: string, params: unknown[] = []) => (await pool.query(sql, params))[0] as any[];
  const json = (v: unknown) => (typeof v === 'string' ? JSON.parse(v) : v);
  return {
    async insertEnquiry(row) {
      const cols = Object.keys(row);
      await q(`INSERT INTO enquiries (id, ${cols.map((c) => `\`${c}\``).join(',')}) VALUES (UUID(), ${cols.map(() => '?').join(',')})`, cols.map((c) => row[c] ?? null));
    },
    async listEnquiries() { return (await q('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 500')).map((r) => ({ ...r, created_at: iso(r.created_at) })); },
    async updateEnquiry(id, status, notes) { await q('UPDATE enquiries SET status=?, notes=? WHERE id=?', [status, notes, id]); },
    async listContent(publishedOnly) { return (await q(`SELECT * FROM site_content ${publishedOnly ? 'WHERE published=1' : ''}`)).map((r) => ({ ...r, published: !!r.published })); },
    async upsertContent(r) { await q('INSERT INTO site_content (`key`,title,body,category,published) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE title=VALUES(title), body=VALUES(body), category=VALUES(category), published=VALUES(published)', [r.key, r.title, r.body, r.category, r.published ? 1 : 0]); },
    async getChat(h) { const r = await q('SELECT messages FROM visitor_chats WHERE token_hash=?', [h]); return r[0] ? json(r[0].messages) : null; },
    async saveChat(h, m) { await q('INSERT INTO visitor_chats (id, token_hash, messages) VALUES (UUID(), ?, ?) ON DUPLICATE KEY UPDATE messages=VALUES(messages)', [h, JSON.stringify(m)]); },
    async listChats() { return (await q('SELECT id, messages, created_at, updated_at FROM visitor_chats ORDER BY updated_at DESC LIMIT 100')).map((r) => ({ ...r, messages: json(r.messages), created_at: iso(r.created_at), updated_at: iso(r.updated_at) })); },
    async rateLimit(key, limit, seconds) {
      await q('INSERT INTO request_limits (`key`, count, window_start) VALUES (?, 1, NOW()) ON DUPLICATE KEY UPDATE count = IF(window_start < NOW() - INTERVAL ? SECOND, 1, count + 1), window_start = IF(window_start < NOW() - INTERVAL ? SECOND, NOW(), window_start)', [key, seconds, seconds]);
      const r = await q('SELECT count FROM request_limits WHERE `key`=?', [key]);
      return Number(r[0]?.count ?? 0) <= limit;
    },
    async assistantBlock() { const r = await q("SELECT blocked, reason FROM ai_access_state WHERE id='assistant'"); return r[0]?.blocked ? String(r[0].reason) : null; },
    async setAssistantBlock(reason) { await q("INSERT INTO ai_access_state (id, blocked, reason) VALUES ('assistant', 1, ?) ON DUPLICATE KEY UPDATE blocked=1, reason=VALUES(reason)", [reason]); },
    async countUsers() { return Number((await q('SELECT COUNT(*) AS n FROM app_users'))[0].n); },
    async findUserByEmail(email) { return (await q('SELECT * FROM app_users WHERE email=?', [email]))[0] ?? null; },
    async createUser(email, hash, role) { await q('INSERT INTO app_users (id, email, password_hash, role) VALUES (UUID(), ?, ?, ?)', [email, hash, role]); },
    async listUsers() { return (await q('SELECT id, email, role, created_at FROM app_users ORDER BY created_at')).map((r) => ({ ...r, created_at: iso(r.created_at) })); },
    async setUserRole(id, role) { await q('UPDATE app_users SET role=? WHERE id=?', [role, id]); },
    async createSession(h, userId, expires) { await q('INSERT INTO app_sessions (token_hash, user_id, expires_at) VALUES (?,?,?)', [h, userId, expires]); },
    async findSessionUser(h) { return (await q('SELECT u.id, u.email, u.role, u.created_at FROM app_sessions s JOIN app_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at > NOW()', [h]))[0] ?? null; },
    async deleteSession(h) { await q('DELETE FROM app_sessions WHERE token_hash=?', [h]); },
  };
}

async function cloudStore(): Promise<Store> {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const db = supabaseAdmin as any;
  const ok = <T,>({ data, error }: { data: T; error: unknown }) => { if (error) throw new Error('Database error'); return data; };
  return {
    async insertEnquiry(row) { ok(await db.from('enquiries').insert(row)); },
    async listEnquiries() { return ok(await db.from('enquiries').select('*').order('created_at', { ascending: false }).limit(500)); },
    async updateEnquiry(id, status, notes) { ok(await db.from('enquiries').update({ status, notes }).eq('id', id)); },
    async listContent(p) { let qy = db.from('site_content').select('*'); if (p) qy = qy.eq('published', true); return ok(await qy); },
    async upsertContent(r) { ok(await db.from('site_content').upsert({ ...r, updated_at: new Date().toISOString() })); },
    async getChat(h) { const d = ok(await db.from('visitor_chats').select('messages').eq('token_hash', h).maybeSingle()) as any; return d ? d.messages : null; },
    async saveChat(h, m) { ok(await db.from('visitor_chats').upsert({ token_hash: h, messages: m, updated_at: new Date().toISOString() }, { onConflict: 'token_hash' })); },
    async listChats() { return ok(await db.from('visitor_chats').select('id,messages,created_at,updated_at').order('updated_at', { ascending: false }).limit(100)); },
    async rateLimit(key, limit, seconds) { const { data, error } = await db.rpc('check_request_limit', { _key: key, _limit: limit, _seconds: seconds }); return !error && !!data; },
    async assistantBlock() { const d = ok(await db.from('ai_access_state').select('blocked,reason').eq('id', 'assistant').maybeSingle()) as any; return d?.blocked ? d.reason : null; },
    async setAssistantBlock(reason) { ok(await db.from('ai_access_state').upsert({ id: 'assistant', blocked: true, reason, updated_at: new Date().toISOString() })); },
    async countUsers() { const { count, error } = await db.from('app_users').select('id', { count: 'exact', head: true }); if (error) throw new Error('Database error'); return count ?? 0; },
    async findUserByEmail(email) { return ok(await db.from('app_users').select('*').eq('email', email).maybeSingle()); },
    async createUser(email, hash, role) { ok(await db.from('app_users').insert({ email, password_hash: hash, role })); },
    async listUsers() { return ok(await db.from('app_users').select('id,email,role,created_at').order('created_at')); },
    async setUserRole(id, role) { ok(await db.from('app_users').update({ role }).eq('id', id)); },
    async createSession(h, userId, expires) { ok(await db.from('app_sessions').insert({ token_hash: h, user_id: userId, expires_at: expires.toISOString() })); },
    async findSessionUser(h) { const d = ok(await db.from('app_sessions').select('expires_at, app_users(id,email,role,created_at)').eq('token_hash', h).maybeSingle()) as any; if (!d || new Date(d.expires_at) < new Date()) return null; return d.app_users; },
    async deleteSession(h) { ok(await db.from('app_sessions').delete().eq('token_hash', h)); },
  };
}
