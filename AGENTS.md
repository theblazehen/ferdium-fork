# Ferdium Fork — Agent Context

Personal fork of Ferdium with Biscuit-style customizations.

## Rules

- **WM_CLASS must remain `ferdium`/`Ferdium`** — don't change `package.json` `name` or `productName`. herbstluftwm rules and tdrop keybindings match on this.
- **Mark all fork changes with `// FORK:` comments** (or `/* FORK: */` for CSS/SCSS).
- **Use mise for tooling** — `.mise.toml` at repo root manages node 22.18.0 and pnpm 10.14.0. Tasks: `mise run dev`, `mise run build`, `mise run typecheck`, `mise run lint`.
- **Recipes submodule** — `recipes/` is a git submodule. Run `git submodule update --init --recursive`, then `pnpm --dir recipes install && pnpm --dir recipes package`, then `node esbuild.mjs` so `build/recipes/` gets populated.
- **Keep service label font size at 12px** — density comes from padding/spacing/icon-size reductions, not font shrinkage.
- **Dev mode** uses `~/.config/FerdiumDev/` (not `~/.config/Ferdium/`).
- **CDP debugging** — `FERDIUM_CDP=1` env var enables remote-debugging-port 9222. `mise run dev` sets this automatically.

## Architecture Notes

- MobX for state, React class components, react-sortable-hoc for drag-and-drop, SCSS for styles.
- `src/features/appearance/index.ts` injects dynamic `<style>` tags with `!important` rules that override SCSS — major source of specificity battles. The fork forces `useLegacyHorizontalStyle = false`.
- `vertical.scss` has `sidebar div { overflow: hidden !important; }` — beware of this clipping sidebar children.
- Workspaces are organizational tags, NOT isolation boundaries. Each service has its own Electron session partition (`persist:service-{uuid}`) independent of workspace membership.
- Cookies stored at `~/.config/Ferdium[Dev]/Partitions/service-{uuid}/`. The `password-store=basic` switch means no keyring dependency.
- Theme border-radius comes from THREE sources: SCSS variables (`globals.scss`), legacy theme exports (`themes/legacy/index.ts`), and JS theme objects (`themes/default/index.ts`). All three zeroed, plus a global `*` safety net in `main.scss`.

### Popup / New-Window Handling

Ferdium had multiple interception layers for popups. The fork collapses them to one:

- **Main process `setWindowOpenHandler`** (`src/index.ts`) returns `{ action: 'allow' }` for all webview popups → child BrowserWindows that inherit the opener's session (cookies flow back automatically).
- **Preload `window.open` patch** (`src/webview/recipe.ts`) delegates ALL calls to `originalWindowOpen()` so the main-process classifier decides. Upstream had a `sendToHost('new-window')` short-circuit that bypassed the main process.
- Dead `new-window` webview event listener removed from `src/models/Service.ts` (Electron 37 doesn't emit it).
- Conflicting module-level `setWindowOpenHandler` removed from `src/index.ts` (was overwriting the webview-specific one).

### Session Partitions & Sandboxes

- Default: each service gets `persist:service-{uuid}` when `sandboxServices: true`.
- Sandbox override: services listed in `~/.config/Ferdium/config/sandboxes.json` share `persist:sandbox-{sandboxId}`.
- Google services (YouTube, Gmail, Toggl) share a `google` sandbox so auth cookies propagate. Any of them can start sign-in — the Google compatibility identity is applied per request to Google hosts, so it does not depend on which service opens the flow. Gmail picks up the session from the shared partition.
- When `sandboxServices: false`, ALL services share `persist:general-session` (not recommended — breaks multi-account).

### Specificity Battles

- `.tab-item.is-active` from dynamic CSS vs `.tab-item--horizontal.is-active` in SCSS — roughly equal specificity. Both now generate left-bar indicators.
- `.sidebar__button { font-size: 22px !important; }` from dynamic CSS — fork's SCSS uses `.sidebar__actions .sidebar__button` to win with higher specificity.
- `.sidebar { width: Npx }` from dynamic CSS — `!important` removed so inline styles from drag-to-resize handle take precedence. Dynamic CSS reads width from localStorage as fallback.
- Forced layout primitives with `!important` in dynamic CSS (lines ~459-480) for `.sidebar`, `.sidebar__services`, `.sidebar__actions`.

## Fork Changes

### 1. Ctrl+W disabled

Removed `role: 'close'` accelerator from Window menu. File: `src/lib/Menu.ts`.

### 2. Cookie encryption bypass

`app.commandLine.appendSwitch('password-store', 'basic')` in `src/index.ts`.

### 3. Auto-updater disabled

Early return in `src/electron/ipc-api/autoUpdate.ts`. Timer noop in `src/stores/AppStore.ts`.

### 4. Zero border-radius everywhere

- Webview CSS injection via MutationObserver: `src/webview/recipe.ts`
- SCSS variables zeroed: `src/styles/globals.scss`
- Global `!important` override: `src/styles/main.scss`
- Theme values zeroed: `src/themes/default/index.ts`, `src/themes/legacy/index.ts`

### 5. Workspace-grouped sidebar

The big feature. Tabbar builds workspace groups with collapsible headers, localStorage persistence, per-group drag-and-drop. Bottom action buttons in horizontal bar. Drag-to-resize handle with localStorage-persisted width (min 150px, max 400px, double-click resets to 200px).

Files:

- `src/components/layout/Sidebar.tsx` — drag-to-resize, inline width, resize handle
- `src/components/services/tabs/Tabbar.tsx` — workspace grouping, collapsible headers, per-group DnD
- `src/components/services/tabs/TabBarSortableList.tsx` — `shortcutIndexOffset` and `groupId` props
- `src/components/services/tabs/TabItem.tsx` — forces labels on, `tab-item--horizontal` class
- `src/containers/layout/AppLayoutContainer.tsx` — passes `services.all` (not workspace-filtered)
- `src/features/appearance/index.ts` — sidebar width from localStorage, forced flex layout primitives
- `src/styles/layout.scss` — sidebar layout, actions bar, resize handle, workspace headers, dark theme
- `src/styles/tabs.scss` — dense tab items (28px height, 18px icons, 12px font), left-bar active indicator
- `src/config.ts` — default sidebar width 200px

### 6. CDP debugging

`FERDIUM_CDP=1` env var enables `--remote-debugging-port=9222`. File: `src/index.ts`.

### 7. Dev crash guards

ENOENT guards for missing `sandboxes.json`, `build/recipes/all.json`, and `Partitions/` directory.
Files: `src/stores/AppStore.ts`, `src/stores/RecipesStore.ts`, `src/containers/settings/RecipesScreen.tsx`.

### 8. In-app popup windows

All webview popups open as child BrowserWindows instead of system browser. OAuth sign-in, target="\_blank" links, and popups all stay in-app.

Files:

- `src/index.ts` — `setWindowOpenHandler` returns `{ action: 'allow' }` for webview contents; removed conflicting module-level handler
- `src/webview/recipe.ts` — removed `sendToHost('new-window')` short-circuit; all `window.open` calls go through `originalWindowOpen()`
- `src/models/Service.ts` — removed dead `new-window` event listener (Electron 37); cleaned unused `isValidExternalURL` import

### 9. Google auth compatibility identity

Google rejects the versioned embedded-Chromium UA. The fork keeps Electron's real Chromium fingerprint (so `navigator.userAgent` and the engine agree) and swaps only the `Chrome/<version>` token for the versionless `Chrome` token — and only for requests bound for Google.

The rewrite is applied **per request** through a session-level `webRequest.onBeforeSendHeaders` handler, never by changing the UA mid-navigation: changing it during a navigation restarts in-flight form POSTs, which breaks form-target OAuth and SAML sign-ins.

- `src/helpers/userAgent-helpers.ts` — `isGoogleUrl` covers `google.com` and `youtube.com` (and subdomains); `userAgentWithoutChromeVersion` strips the version token
- `src/index.ts` — one composed `onBeforeSendHeaders` handler per session. Electron permits only ONE per session, and recipes register theirs via `modifyRequestHeaders` (WhatsApp uses `*://*/*`), so recipe rules and the Google rule are composed rather than competing for the slot. Popups share the opener's session, so the request rule covers them; the popup's own identity is set before its first request and re-asserted on `did-navigate`. Note a click-opened popup has already committed its first document, so its DOM identity applies from the next navigation.
- `src/helpers/session-header-rules.ts` — the composed rule registry and match-pattern check, kept free of Electron imports so it is directly testable
- `src/models/UserAgent.ts` — resolves the service's URL lazily so a Google-hosted service keeps one identity for its whole lifetime

Because the rule is keyed on the request URL, Google OAuth works from **any** service, not only Google-hosted ones.

Client hints: no `sec-ch-ua*` request header reaches the server in this Electron build — measured against a live header-echo endpoint over real TLS, for Electron's default identity, the versionless identity, and (as a positive control) a Firefox identity alike. `UserAgentClientHint` is absent from the shipped binary's feature strings, consistent with Electron disabling the HTTP hint headers. No hint-stripping code is therefore needed; `src/index.ts` carries only `CrossOriginOpenerPolicy` in its `disable-features` switch.

Caveat, measured and not fixed: the JS-level `navigator.userAgentData` is engine-derived and still reports `Chromium;v="152"` even while the UA string is versionless (verified on the live Google sign-in page). A UA string cannot change it. Google's live sign-in page renders normally under both the default and the versionless identity, so nothing currently depends on it, but the versionless UA string is not a complete fingerprint mask.

Scope of the identity rule: it keys on the **request URL**, so the versionless identity applies to any Google-bound request — Google OAuth opened from an arbitrary non-Google service included, which is the case that matters. The per-service DOM identity in `src/models/UserAgent.ts` is resolved from the service's own URL; a non-Google service that navigates its webview to a Google page will therefore send versionless request headers while its document-level `navigator.userAgent` stays versioned. Reconciling that would require mutating the UA during navigation, which is exactly what cancels in-flight form POSTs, so it is deliberately not done.

Files:

- `src/helpers/userAgent-helpers.ts` — `isGoogleUrl`, `userAgentWithoutChromeVersion`, Chromium-consistent default UA
- `src/index.ts` — composed session header handler, popup identity adoption
- `src/models/UserAgent.ts` — lazy service-URL resolution, stable identity per service

### 10. Live favicon in sidebar

All services get their actual site favicon via the `page-favicon-updated` webview event, replacing the static recipe SVG. Falls back to Google S2 proxy (if `useFavicon` enabled), then recipe default. Custom user icons (`iconUrl`) always take priority. Favicon survives hibernation (stale icon retained).

Files:

- `src/models/Service.ts` — `@observable liveFaviconUrl`, `@action _didUpdateFavicon`, `page-favicon-updated` listener, modified `@computed get icon()` priority chain

### 11. Toggl timer in sidebar

Parses Toggl's live page title (`HH:MM:SS - description - project • Toggl Track`) via `page-title-updated` webview event. Displays elapsed time inline in the sidebar tab item with monospace styling. Title tooltip shows the task description and project.

Files:

- `src/models/Service.ts` — `@observable livePageTitle`, `@action _didUpdatePageTitle`, `page-title-updated` listener
- `src/components/services/tabs/TabItem.tsx` — Toggl timer display after label (regex parse, recipe ID check)
- `src/styles/tabs.scss` — `.tab-item__status-text` styling (10px monospace, 60% opacity)

### 12. File drag-and-drop into webviews

Upstream had blanket `dragover`/`drop` `preventDefault()` + `stopPropagation()` on the host renderer's `window` to prevent accidental file-navigation. This competed with webview guests for drop target ownership, causing flickering drop zones and lost drops. Fixed by skipping `preventDefault()` when the drag target is a `<webview>` element.

File: `src/app.tsx`

### 13. Build optimization

Linux targets reduced to `dir` x64 only (was AppImage, deb, rpm, snap, tar.gz for x64/arm64/armv7l).

File: `electron-builder.yml`

## Biscuit Migration

`scripts/migrate-biscuit.py` imports tabs, groups, and session data (cookies, localStorage, IndexedDB) from Biscuit (`~/.config/biscuit/`) into FerdiumDev. Handles Biscuit's shared partitions by duplicating to separate Ferdium services. Run with `--execute --clean`.

## Build & Deploy

- `mise run build` builds to `out/linux-unpacked/` (electron-builder `--linux dir`).
- `out/linux-unpacked/ferdium` is the production binary. tdrop launches it directly via full path.
- Desktop keybindings (`~/.xbindkeysrc` b:8, hlwm Print key) use `tdrop /home/jasmin/Projects/forks/ferdium-app/out/linux-unpacked/ferdium`.
- hlwm rule `instance=ferdium fullscreen=true` matches on WM_CLASS.
- System ferdium at `/usr/bin/ferdium` is the upstream package — don't use it.
- `node esbuild.mjs` compiles clean.
- `tsc --noEmit` has 2 pre-existing type errors (unused params from fork changes in `autoUpdate.ts` and `appearance/index.ts`).
