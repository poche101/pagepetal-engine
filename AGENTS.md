<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Data access goes through `src/lib/store.server.ts`: MySQL when `DATABASE_URL` is set (self-hosting), Lovable Cloud otherwise — keeps one codebase deployable both places.
- Staff auth is app-owned (PBKDF2 hashes + HttpOnly session cookie in `app_users`/`app_sessions`), not Supabase Auth, so it works on the owner's own server.
- Assistant uses `OPENAI_API_KEY`/`OPENAI_MODEL` directly when set, else the Lovable AI Gateway.
- Self-host build: `SELF_HOST=1 npm run build` outside the Lovable sandbox produces a Node server in `.output`; see `selfhost/`.
