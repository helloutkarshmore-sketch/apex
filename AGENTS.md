<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Application architecture

- Use TanStack file routes, flat dot-separated children and the `_authenticated` layout for private pages; this preserves typed navigation and keeps session-dependent rendering client-side.
- Keep commerce providers and shared navigation around the root Outlet; this shares basket and auth state across pages without replacing the router.
- Fetch public catalog data through a publishable-key server function with TanStack Query; this supports SSR without exposing privileged credentials.
- Put permission-checked app mutations in `.functions.ts` and enforce ownership, inventory validation and roles in PostgreSQL as well; browser controls are not security boundaries.
- Keep administrator roles separate from profiles and bootstrap the designated owner only after hosted email verification; editable metadata must never grant privileges.
- Store uploaded media through asset pointers and private enquiry attachments in ownership-gated storage; avoid binaries or confidential documents in source control.
- Keep approved retail prices, stock and GST nullable until configured; historical sales quantities and totals are not inventory or storefront prices.
- Serialize basket mutations and use latest basket state for additions; asynchronous writes must not lose quantities from rapid clicks.
