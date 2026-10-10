import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getAdminData, saveContent, updateLead } from '@/lib/site.functions';
import { products } from '@/lib/site-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [claimed, setClaimed] = useState(false);
  useEffect(() => { supabase.rpc('claim_first_admin').then(() => setClaimed(true)); }, []);
  const { data, isLoading } = useQuery({ queryKey: ['admin'], queryFn: () => fetchData(), enabled: claimed });

  async function signOut() {
    await qc.cancelQueries(); qc.clear(); await supabase.auth.signOut(); navigate({ to: '/auth', replace: true });
  }

  if (isLoading || !data) return <main className="section"><div className="site-container">Loading dashboard…</div></main>;
  if (!data.allowed) return <main className="section"><div className="site-container max-w-lg"><h1 className="section-title">Access pending</h1><p className="section-copy">Your account is signed in but hasn't been given staff access yet. Ask an existing administrator to grant it.</p><Button variant="outline" onClick={signOut}>Sign out</Button></div></main>;

  return (
    <main className="section">
      <div className="site-container">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div><div className="eyebrow">DASHBOARD</div><h1 className="section-title">Manage Bracon</h1></div>
          <Button variant="outline" onClick={signOut}>Sign out</Button>
        </div>
        <Tabs defaultValue="leads">
          <TabsList><TabsTrigger value="leads">Enquiries ({data.leads.length})</TabsTrigger><TabsTrigger value="catalogue">Catalogue</TabsTrigger><TabsTrigger value="chats">Assistant ({data.chats.length})</TabsTrigger></TabsList>
          <TabsContent value="leads" className="mt-6 space-y-4">
            {data.leads.length === 0 && <p className="text-muted-foreground">No enquiries yet.</p>}
            {data.leads.map((l) => <Lead key={l.id} lead={l} />)}
          </TabsContent>
          <TabsContent value="catalogue" className="mt-6 space-y-4">
            {products.map((p) => <ProductEditor key={p.slug} slug={p.slug} name={p.name} description={p.description} row={data.content.find((c) => c.key === `product:${p.slug}`)} />)}
          </TabsContent>
          <TabsContent value="chats" className="mt-6 space-y-4">
            {data.chats.length === 0 && <p className="text-muted-foreground">No conversations yet.</p>}
            {data.chats.map((c) => (
              <details key={c.id} className="rounded-md border bg-card p-4">
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
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </main>
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
