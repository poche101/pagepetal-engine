import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { useServerFn } from '@tanstack/react-start';
import { signIn, signUp } from '@/lib/auth.functions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/auth')({
  head: () => ({
    meta: [
      { title: 'Administrator sign in — Bracon Wire & Cable' },
      { name: 'description', content: 'Sign in to manage the Bracon catalogue, enquiries and assistant conversations.' },
      { property: 'og:title', content: 'Administrator sign in — Bracon Wire & Cable' },
      { property: 'og:description', content: 'Staff access to the Bracon website dashboard.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const doIn = useServerFn(signIn);
  const doUp = useServerFn(signUp);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = mode === 'in' ? await doIn({ data: { email, password } }) : await doUp({ data: { email, password } });
      if (r.role === 'pending') toast.message('Your account is waiting for an administrator to approve it.');
      navigate({ to: '/admin' });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="section">
      <div className="site-container max-w-md">
        <div className="eyebrow">STAFF ACCESS</div>
        <h1 className="section-title">{mode === 'in' ? 'Administrator sign in' : 'Create staff account'}</h1>
        <form onSubmit={submit} className="mt-8 space-y-4 rounded-md border bg-card p-6">
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <Button type="submit" className="w-full" disabled={busy}>{busy ? 'Please wait…' : mode === 'in' ? 'Sign in' : 'Create account'}</Button>
          <button type="button" className="w-full text-sm text-muted-foreground underline" onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>
            {mode === 'in' ? 'New staff member? Create an account' : 'Already have an account? Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
