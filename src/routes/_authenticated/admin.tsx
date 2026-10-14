import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useState } from 'react';
import { toast } from 'sonner';
import { getAdminData, saveContent, updateLead, setStaffRole } from '@/lib/site.functions';
import { signOut as signOutFn } from '@/lib/auth.functions';
import { products } from '@/lib/site-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LayoutDashboard, Inbox, FileText, Package, MessageSquare, Bell, CheckCircle2, ExternalLink, LogOut, Users } from 'lucide-react';
import { BrandMark } from '@/components/site';

export const Route = createFileRoute('/_authenticated/admin')({
  head: () => ({
    meta: [
      { title: 'Dashboard — Bracon Wire & Cable' },
      { name: 'description', content: 'Manage the Bracon catalogue, enquiries and assistant conversations.' },
      { property: 'og:title', content: 'Dashboard — Bracon Wire & Cable' },
      { property: 'og:description', content: 'Bracon staff dashboard.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: Admin,
});

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Not Interested', 'Closed'] as const;

function Admin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchData = useServerFn(getAdminData);
  const doSignOut = useServerFn(signOutFn);
  const { data, isLoading } = useQuery({ queryKey: ['admin'], queryFn: () => fetchData() });

  async function signOut() {
    await qc.cancelQueries(); qc.clear(); await doSignOut(); navigate({ to: '/auth', replace: true });
  }

  const [tab, setTab] = useState('overview');
  if (isLoading || !data) return <main className="section"><div className="site-container">Loading dashboard…</div></main>;
  if (!data.allowed) return <main className="section"><div className="site-container max-w-lg"><h1 className="section-title">Access pending</h1><p className="section-copy">Your account is signed in but hasn't been given staff access yet. Ask an existing administrator to grant it.</p><Button variant="outline" onClick={signOut}>Sign out</Button></div></main>;

  const newLeads = data.leads.filter((l) => l.status === 'New').length;
  const converted = data.leads.filter((l) => l.status === 'Converted').length;
  const nav = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Enquiries', icon: Inbox, count: newLeads },
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'catalogue', label: 'Catalogue', icon: Package },
    { id: 'chats', label: 'Assistant', icon: MessageSquare, count: data.chats.length },
    ...(data.me.role === 'admin' ? [{ id: 'staff', label: 'Staff', icon: Users, count: data.users.filter((u) => u.role === 'pending').length }] : []),
  ];
  const stats = [
    { label: 'Total enquiries', value: data.leads.length, icon: Inbox },
    { label: 'New, awaiting reply', value: newLeads, icon: Bell, accent: true },
    { label: 'Converted', value: converted, icon: CheckCircle2 },
    { label: 'Assistant chats', value: data.chats.length, icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-muted">
      <aside className="hidden w-60 shrink-0 flex-col bg-inverse text-inverse-foreground md:flex">
        <div className="flex items-center gap-3 border-b border-inverse-foreground/10 p-5"><BrandMark /><div><strong className="block text-sm">Bracon</strong><small className="text-xs opacity-60">Admin console</small></div></div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${tab === n.id ? 'bg-primary text-primary-foreground' : 'opacity-75 hover:bg-inverse-foreground/10 hover:opacity-100'}`}>
              <n.icon className="size-4" />{n.label}{!!n.count && <span className="ml-auto rounded-full bg-brand-orange px-2 text-xs text-primary-foreground">{n.count}</span>}
            </button>
          ))}
        </nav>
        <div className="space-y-1 border-t border-inverse-foreground/10 p-3">
          <a href="/" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm opacity-75 hover:opacity-100"><ExternalLink className="size-4" />View website</a>
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm opacity-75 hover:opacity-100"><LogOut className="size-4" />Sign out</button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <h1 className="text-lg font-bold">{nav.find((n) => n.id === tab)?.label}</h1>
          <div className="flex items-center gap-2 md:hidden">
            <select className="h-9 rounded-md border bg-background px-2 text-sm" value={tab} onChange={(e) => setTab(e.target.value)}>{nav.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}</select>
            <Button size="sm" variant="outline" onClick={signOut}><LogOut /></Button>
          </div>
        </header>
        <main className="space-y-4 p-6">
          {tab === 'overview' && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-lg border bg-background p-5">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">{s.label}<s.icon className={`size-5 ${s.accent ? 'text-brand-orange' : 'text-primary'}`} /></div>
                    <div className="mt-3 text-3xl font-bold">{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border bg-background">
                <div className="flex items-center justify-between border-b p-4"><strong>Latest enquiries</strong><Button size="sm" variant="link" onClick={() => setTab('leads')}>View all</Button></div>
                {data.leads.length === 0 ? <p className="p-4 text-sm text-muted-foreground">No enquiries yet.</p> : (
                  <table className="w-full text-sm">
                    <thead className="text-left text-muted-foreground"><tr><th className="p-3">Name</th><th className="p-3">Type</th><th className="hidden p-3 sm:table-cell">Product</th><th className="p-3">Status</th><th className="hidden p-3 sm:table-cell">Date</th></tr></thead>
                    <tbody>{data.leads.slice(0, 6).map((l) => <tr key={l.id} className="border-t"><td className="p-3 font-medium">{l.name}</td><td className="p-3 capitalize">{l.kind}</td><td className="hidden p-3 sm:table-cell">{l.product || '—'}</td><td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs ${l.status === 'New' ? 'bg-brand-orange text-primary-foreground' : 'bg-accent text-primary'}`}>{l.status}</span></td><td className="hidden p-3 sm:table-cell">{new Date(l.created_at).toLocaleDateString()}</td></tr>)}</tbody>
                  </table>
                )}
              </div>
            </>
          )}
          {tab === 'leads' && (data.leads.length === 0 ? <p className="text-muted-foreground">No enquiries yet.</p> : data.leads.map((l) => <Lead key={l.id} lead={l} />))}
          {tab === 'pages' && PAGES.map((pg) => <PageEditor key={pg.key} pageKey={pg.key} label={pg.label} row={data.content.find((c) => c.key === pg.key)} />)}
          {tab === 'catalogue' && products.map((p) => <ProductEditor key={p.slug} slug={p.slug} name={p.name} description={p.description} row={data.content.find((c) => c.key === `product:${p.slug}`)} />)}
          {tab === 'staff' && data.users.map((u) => <StaffRow key={u.id} user={u} self={u.id === data.me.id} />)}
          {tab === 'chats' && (data.chats.length === 0 ? <p className="text-muted-foreground">No conversations yet.</p> : data.chats.map((c) => (
            <details key={c.id} className="rounded-lg border bg-background p-4">
              <summary className="cursor-pointer font-semibold">Conversation · {new Date(c.updated_at).toLocaleString()}</summary>
              <div className="mt-4 space-y-3">
                {(Array.isArray(c.messages) ? c.messages : []).map((m: any, i: number) => (
                  <div key={i} className={m.role === 'user' ? 'rounded bg-muted p-3' : 'p-3'}>
                    <div className="text-xs font-semibold uppercase text-muted-foreground">{m.role === 'user' ? 'Visitor' : 'Assistant'}</div>
                    <p className="whitespace-pre-wrap text-sm">{(m.parts ?? []).filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n') || m.content}</p>
                  </div>
                ))}
              </div>
            </details>
          )))}
        </main>
      </div>
    </div>
  );
}

function Lead({ lead }: { lead: any }) {
  const save = useServerFn(updateLead);
  const qc = useQueryClient();
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes);
  return (
    <div className="rounded-md border bg-card p-5">
      <div className="flex flex-wrap justify-between gap-2"><strong>{lead.name} · {lead.kind}</strong><span className="text-sm text-muted-foreground">{new Date(lead.created_at).toLocaleString()}</span></div>
      <p className="text-sm text-muted-foreground">{lead.email}{lead.phone && ` · ${lead.phone}`}{lead.company && ` · ${lead.company}`}{lead.location && ` · ${lead.location}`}{lead.product && ` · ${lead.product}`}</p>
      <p className="mt-3 whitespace-pre-wrap">{lead.message}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-[200px_1fr_auto]">
        <select className="h-10 rounded-md border bg-background px-3" value={status} onChange={(e) => setStatus(e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <Input placeholder="Internal notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button onClick={async () => { try { await save({ data: { id: lead.id, status, notes } }); toast.success('Saved'); qc.invalidateQueries({ queryKey: ['admin'] }); } catch (e) { toast.error((e as Error).message); } }}>Save</Button>
      </div>
    </div>
  );
}

function ProductEditor({ slug, name, description, row }: { slug: string; name: string; description: string; row?: { title: string; body: string; category: string } | undefined }) {
  const save = useServerFn(saveContent);
  const qc = useQueryClient();
  const [title, setTitle] = useState(row?.title ?? name);
  const [body, setBody] = useState(row?.body ?? description);
  const [hidden, setHidden] = useState(row?.category === 'hidden');
  return (
    <div className="rounded-md border bg-card p-5 space-y-3">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Product name" />
      <Textarea value={body} onChange={(e) => setBody(e.target.value)} aria-label="Product description" />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} /> Hide from website</label>
        <Button onClick={async () => { try { await save({ data: { key: `product:${slug}`, title, body, category: hidden ? 'hidden' : 'product', published: true } }); toast.success('Product updated'); qc.invalidateQueries(); } catch (e) { toast.error((e as Error).message); } }}>Save product</Button>
      </div>
    </div>
  );
}

const PAGES = [
  { key: 'about', label: 'About page' },
  { key: 'services', label: 'Services page' },
  { key: 'contact', label: 'Contact page' },
  { key: 'quality', label: 'Quality page' },
];

function PageEditor({ pageKey, label, row }: { pageKey: string; label: string; row?: { title: string; body: string } | undefined }) {
  const save = useServerFn(saveContent);
  const qc = useQueryClient();
  const [title, setTitle] = useState(row?.title ?? '');
  const [body, setBody] = useState(row?.body ?? '');
  return (
    <div className="rounded-md border bg-card p-5 space-y-3">
      <div className="eyebrow">{label}</div>
      <Input placeholder="Heading (leave empty to keep the current one)" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea rows={6} placeholder="Page text (leave empty to keep the current text)" value={body} onChange={(e) => setBody(e.target.value)} />
      <div className="flex justify-end"><Button onClick={async () => { try { await save({ data: { key: pageKey, title: title || label, body, category: 'page', published: true } }); toast.success('Page updated'); qc.invalidateQueries(); } catch (e) { toast.error((e as Error).message); } }}>Save page</Button></div>
    </div>
  );
}

function StaffRow({ user, self }: { user: { id: string; email: string; role: string; created_at: string }; self: boolean }) {
  const save = useServerFn(setStaffRole);
  const qc = useQueryClient();
  const [role, setRole] = useState(user.role);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background p-4">
      <div><strong>{user.email}</strong><p className="text-xs text-muted-foreground">Joined {new Date(user.created_at).toLocaleDateString()}</p></div>
      {self ? <span className="text-sm text-muted-foreground">You (administrator)</span> : (
        <div className="flex gap-2">
          <select className="h-9 rounded-md border bg-background px-2 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="pending">Waiting for approval</option><option value="staff">Staff</option><option value="admin">Administrator</option>
          </select>
          <Button size="sm" onClick={async () => { try { await save({ data: { id: user.id, role: role as 'staff' } }); toast.success('Access updated'); qc.invalidateQueries({ queryKey: ['admin'] }); } catch (e) { toast.error((e as Error).message); } }}>Save</Button>
        </div>
      )}
    </div>
  );
}
