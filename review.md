# Code Review — Jessica Clarke Dennis Personal Site

**Reviewed:** Sunday 26 April 2026  
**Reviewer:** AI assisted self-review (all files examined, no code changed)  
**Scope:** All files under `src/`, `next.config.ts`, `tsconfig.json`, `.gitignore`, `package.json`

---

## 1. Summary verdict

| Area | Rating | Notes |
|------|--------|-------|
| Security | ⚠️ Fair | API key is correctly server-only; several issues still present (see §4) |
| Code quality | ✅ Good | Clean structure, consistent style, good TypeScript discipline |
| Accessibility (a11y) | ⚠️ Fair | Some gaps: missing skip link, heading hierarchy, focus styles |
| Performance | ⚠️ Fair | Unnecessary client-side JS, no metadata images, heavy inline gradient |
| Maintainability | ✅ Good | Single source-of-truth data file, types exported |
| Robustness | ✅ Good | Server handler is well-defended; client chat recovers from errors |
| SEO | ⚠️ Fair | Missing OG/Twitter meta, sitemap, no structured data |
| Git hygiene | ⚠️ Fair | Uncommitted changes, no `.env.example`, `.gitignore` is minimal |

---

## 2. File-by-file findings

---

### 2.1 `src/app/layout.tsx`

**What it does:** Wraps every page with fonts, global CSS, and the navigation header.

#### Findings

| # | Severity | Issue | Line |
|---|----------|-------|------|
| L1 | ⚠️ Medium | `Geist_Mono` is loaded and attached to `<html>` but the monospace font is never actually used in any component or CSS. Unused font variants add a network request and CSS variable. | 11–13, 30 |
| L2 | 💡 Low | The `metadata` object only has `title` and `description`. Missing **OpenGraph** (`openGraph: { ... }`) and **Twitter card** properties means social-media link previews show no image or card formatting. | 16–20 |
| L3 | 💡 Low | No `<link rel="canonical" ...>` or `metadataBase` in `metadata`. Next.js recommends `metadataBase` so absolute OG image URLs resolve correctly on deployment. | 16 |
| L4 | ⚠️ Medium | No **skip-navigation link** (`<a href="#about" className="sr-only focus:not-sr-only">Skip to content</a>`) before `<SiteHeader />`. Keyboard-only users must tab through every nav link to reach main content. | 33 |

---

### 2.2 `src/app/page.tsx`

**What it does:** Renders the entire homepage (About, Experience, Agent, Education, Portfolio, Footer).

#### Findings

| # | Severity | Issue | Line |
|---|----------|-------|------|
| P1 | 🔴 High | **Heading hierarchy is broken.** The `<h1>` is *inside* the `#about` section (correct) but the **Education** and **Portfolio** sections use `<h2>` headings inside `<article>` elements that have no `<h2>`-or-higher parent. The Career Journey section uses `<h2>` for section heading and `<h3>` for job title — that part is fine — but the education/portfolio `<article>`s are siblings rather than children, which screen readers may interpret as separate documents. | 96–99, 127, 154 |
| P2 | ⚠️ Medium | **Inconsistent indentation in the `#about` grid.** The inner `<div>` (hero card) and `<aside>` (Core Strengths) are not indented to the same level as the grid container `<div>`. This is cosmetic but makes diffs and future editing harder to read. | 18–87 |
| P3 | ⚠️ Medium | **Portfolio link is a dead `href="#"`**. An anchor pointing to `#` scrolls the user to the top of the page and adds `#` to the browser history — both surprising behaviours. A `<span>` (with `aria-disabled`) or a `<button disabled>` would be more semantically honest. | 162 |
| P4 | 💡 Low | The **footer email** is hard-coded as a string (`jmclarke826@gmail.com`) while the rest of the codebase imports it from `contact.email` in `careerProfile.ts`. If the email ever changes, the footer will diverge silently. | 179–182 |
| P5 | 💡 Low | The `Education` section data is duplicated: it is in `careerProfile.ts` (the `education` array) **and** hard-coded in JSX in `page.tsx`. If you edit one you must remember to edit the other. The `education` export should drive the page. | 128–147 |
| P6 | 💡 Low | The huge **inline radial-gradient string** on line 7 is long enough (~180 chars) to be difficult to read, edit, or apply consistently. Moving it to a Tailwind `@layer base` rule or a named CSS custom property in `globals.css` would keep the JSX readable. | 7 |
| P7 | 💡 Low | The `milestones` key uses `${item.company}-${item.period}`. Two roles at the same company in the same period (unlikely but possible as data grows) would produce a duplicate key warning. A simple numeric or `uuid`-based key — or at minimum adding `item.role` — is safer. | 105 |

---

### 2.3 `src/app/globals.css`

**What it does:** Imports Tailwind, sets CSS variables and body defaults, enables smooth scroll.

#### Findings

| # | Severity | Issue | Line |
|---|----------|-------|------|
| C1 | ✅ | `prefers-reduced-motion` is correctly handled — good accessibility practice. | 7–11 |
| C2 | 💡 Low | The `@media (prefers-color-scheme: dark)` block on lines 25–30 sets the same values as `:root`. Since the background is always `#020617` (dark), this block is redundant — it does nothing. It can be removed to reduce confusion. | 25–30 |
| C3 | 💡 Low | The `@theme inline` block (lines 18–23) registers `--font-sans` and `--font-mono` as Tailwind theme tokens. Since `--font-mono` is registered in Tailwind but the mono font is never used (see L1), this is dead configuration. | 18–23 |

---

### 2.4 `src/components/SiteHeader.tsx`

**What it does:** Sticky top navigation bar with brand name, three nav links, and `<ContactButton>`.

#### Findings

| # | Severity | Issue | Line |
|---|----------|-------|------|
| S1 | ⚠️ Medium | There is **no mobile hamburger menu**. On very narrow screens the nav links wrap below the brand name, which is acceptable at current link count, but adding a fourth link will cause overflow/layout issues without a collapse. | 20–33 |
| S2 | 💡 Low | The nav links use plain `<a>` tags. In a Next.js app, same-page anchor links work fine with `<a>`, but if pages are ever added, links to other routes should use Next.js `<Link>` for prefetching. Worth noting for future growth. | 24–32 |
| S3 | 💡 Low | No **active/current-page** indicator on nav links. Adding a visual cue (e.g. highlight when a section is in the viewport via `IntersectionObserver`) would help users track their position on the page. | 24–32 |
| S4 | 💡 Low | `SiteHeader` imports `ContactButton`, making it a **server component that renders a client component**. This pattern is fine in Next.js, but it means the entire header HTML is generated server-side except for the interactive island. No change needed, just worth understanding. | 1 |

---

### 2.5 `src/components/ContactButton.tsx`

**What it does:** `mailto:` link + clipboard copy fallback button.

#### Findings

| # | Severity | Issue | Line |
|---|----------|-------|------|
| CB1 | ⚠️ Medium | The `window.setTimeout` call on line 24 is **not cleared on unmount**. If the component unmounts before 2 seconds elapse (e.g. navigation), the timeout fires and tries to call `setStatus` on an unmounted component. In React 19 this is a warning rather than a crash, but it is still poor practice. The fix is to capture the timeout ID and call `clearTimeout` in a cleanup function. | 24 |
| CB2 | 💡 Low | The `status === "err"` message disappears only if the user successfully copies later, meaning the error persists indefinitely if clipboard is unavailable. Adding an `"idle"` reset after a timeout (similar to the "copied" reset) would be friendlier. | 49–56 |
| CB3 | 💡 Low | The `"use client"` directive is correct here (uses `useState` and `navigator.clipboard`). The `import { contact }` from `careerProfile.ts` is also correct — data-only imports from server-compatible modules work fine in client components. | 1, 4 |

---

### 2.6 `src/components/DigitalTwinChat.tsx`

**What it does:** Client-side chat UI, manages conversation state, posts to the API.

#### Findings

| # | Severity | Issue | Line |
|---|----------|-------|------|
| D1 | 🔴 High | **The chat has no message history limit on the client.** `messages` grows unboundedly as the user chats. The server truncates to 24 messages, but the client renders them all. With many exchanges the DOM grows, scrolling becomes sluggish, and memory use increases. Cap display at ~50 messages client-side with a "scroll up to see earlier messages" note. | 16, 34 |
| D2 | ⚠️ Medium | **No `AbortController` / request cancellation.** If the user sends a message and then navigates away or sends another, the in-flight fetch is not cancelled. The response from the earlier request may arrive after the later one and overwrite it in state. Using `AbortController` with `signal` on the fetch call would fix this. | 41–48 |
| D3 | ⚠️ Medium | The `send` function is defined inside the component but **not wrapped in `useCallback`**. Because `DigitalTwinChat` holds state, `send` is recreated on every render. While this does not cause bugs here (it is not passed as a prop), it is inconsistent with `scrollToBottom` which is `useCallback`-wrapped. | 28 |
| D4 | ⚠️ Medium | **Chat messages are rendered as plain text**. The AI may respond with markdown-style formatting (e.g. `**bold**`, bullet points). These render as literal asterisks rather than formatted text. Adding a lightweight markdown renderer (e.g. `react-markdown`) would make answers much more readable. | 104 |
| D5 | 💡 Low | The `key` for rendered messages is `${i}-${m.role}`. Using the array index `i` as part of a key is acceptable here because messages are only appended (never reordered or removed from the middle), but it is worth commenting that assumption. | 97 |
| D6 | 💡 Low | `scrollToBottom` uses `requestAnimationFrame` which is a browser API. In a server-rendering context this is fine because the component is client-only (`"use client"`), but if Next.js ever pre-renders this component there would be a `requestAnimationFrame is not defined` error. A `typeof window !== "undefined"` guard future-proofs this. | 23–25 |
| D7 | 💡 Low | The `error` state is shown but **never cleared except when the next message is sent**. If the user reads the error and changes their mind, there is no dismiss button. A small × button on the error banner would be a quick UX improvement. | 115–119 |

---

### 2.7 `src/app/api/digital-twin/route.ts`

**What it does:** Server-side POST handler — validates the request, calls OpenRouter, returns the assistant reply.

#### Findings

| # | Severity | Issue | Line |
|---|----------|-------|------|
| A1 | 🔴 High | **No rate limiting.** Any visitor (or automated script) can spam this endpoint, burning your OpenRouter credits. Since there is no authentication, adding IP-based rate limiting (e.g. with Vercel's Edge Config, `upstash/ratelimit`, or a simple in-memory counter) is important before the site is public. | 104 |
| A2 | 🔴 High | **The `OPENROUTER_API_KEY` is checked but `OPENROUTER_MODEL` is not validated.** If someone sets `OPENROUTER_MODEL` to an empty string `""`, `process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL` correctly falls back (empty string is falsy). However if set to `" "` (a space), `.trim()` returns `""` which is falsy, so the fallback works too. This is actually fine, but it is worth noting the model value is never logged or surfaced in errors, making debugging a misconfigured model harder. | 138–139 |
| A3 | ⚠️ Medium | **No request timeout on the upstream `fetch` call.** If OpenRouter is slow or stalls, the handler will wait up to `maxDuration` (60s). Adding an `AbortSignal.timeout(30_000)` as the `signal` option on the fetch call would return a friendlier error faster. | 150 |
| A4 | ⚠️ Medium | **The knowledge base is rebuilt on every single request** (`buildDigitalTwinKnowledgeBase()` is called inside the POST handler). Since `careerProfile.ts` is static at build time, this string could be computed **once at module load** (moved to module scope) and reused across requests. The current approach does not cause bugs but wastes CPU. | 129 |
| A5 | ⚠️ Medium | **No `Content-Type` header validation on the incoming request.** The handler calls `request.json()` directly. Sending a `Content-Type: text/plain` body with JSON still works, but explicitly checking `request.headers.get("content-type")?.includes("application/json")` first would be more correct. | 113–118 |
| A6 | ⚠️ Medium | **Error responses include the raw OpenRouter error message** passed directly to the client. In some edge cases (key format errors, account suspension messages) these messages may expose internal details. Logging the full message server-side and returning a sanitized version to the client would be safer. | 182–187 |
| A7 | 💡 Low | The `sanitizeMessages` function silently **drops messages longer than 8,000 characters** (line 22). If a user pastes a long paragraph, their message disappears without feedback. Truncating to 8,000 characters rather than dropping entirely, or returning a 400 error explaining the limit, would be more user-friendly. | 22 |
| A8 | 💡 Low | `normalizeContent` falls back to `String(content)` for unknown shapes (line 101). This could turn an entire JSON object into `"[object Object]"` in the assistant reply. A final fallback of `return ""` (and letting `extractAssistantText` return `null`) would prevent that from reaching the user. | 101 |
| A9 | 💡 Low | There is no logging anywhere in the handler. Production debugging is very hard without at least a `console.error(...)` in the catch blocks and on unexpected response shapes. | throughout |

---

### 2.8 `src/data/careerProfile.ts`

**What it does:** Single source of truth for all career content, exported for both the page and the AI knowledge base.

#### Findings

| # | Severity | Issue | Line |
|---|----------|-------|------|
| CP1 | ⚠️ Medium | **`education` data is defined here but not used by `page.tsx`.** The education section in `page.tsx` is hand-coded JSX (see P5 above). The two will drift apart if you update one but not the other. | 80–90 |
| CP2 | ⚠️ Medium | **`topSkills` is used in the knowledge base but not rendered on the page.** The page has its own Core Strengths list (different content, different format) in `page.tsx`. There are now two separate skills lists: one for the page visitor and one for the AI. These are intentionally different in format but could diverge in meaning over time. A comment noting this dual-purpose design would help. | 70–78 |
| CP3 | 💡 Low | `careerSummary` is a very long string literal on a single line (line 68, ~600 chars). It is readable in most editors but a multiline template literal or an array of sentences would be easier to edit. | 68 |
| CP4 | 💡 Low | The `Milestone` type uses `role: string` etc., with no minimum-length or non-empty constraint. TypeScript cannot enforce "this must not be empty" at compile time, but adding a runtime guard in `buildDigitalTwinKnowledgeBase` (skip milestones with empty `impact`) would make the knowledge base more robust as data grows. | 1–7 |

---

## 3. Security review

| Issue | Severity | Detail |
|-------|----------|--------|
| **API key exposure** | ✅ Safe | `OPENROUTER_API_KEY` is read inside `route.ts` on the server. It is never imported into or exposed to any client component. |
| **`.env` in `.gitignore`** | ✅ Safe | `.env` is listed in `.gitignore` so the key will not be committed. |
| **No `.env.example`** | ⚠️ Medium | There is no `.env.example` file documenting what variables are needed. Anyone cloning the repo (including future-you on a new machine) will not know which keys to set without reading the source. |
| **Input sanitization** | ✅ Good | `sanitizeMessages` validates roles, types, and lengths before any data reaches OpenRouter. |
| **Prompt injection** | ⚠️ Medium | A clever user could attempt to override the system prompt via a crafted message (e.g. "Ignore previous instructions and..."). This is an inherent risk of LLM-backed chat. Mitigations include: (a) instructing the model to refuse meta-instructions (already partially done), (b) post-processing the reply to check for off-topic content, (c) filtering user input for common injection patterns. |
| **Rate limiting** | 🔴 High | Absent (see A1). Any visitor can spam the endpoint. |
| **Profile (1).pdf in repo** | ⚠️ Medium | The LinkedIn PDF was committed to git and is present in the public repository. It contains personal contact details (email). Consider removing it from version control with `git rm` and adding `*.pdf` to `.gitignore`. |

---

## 4. Accessibility (a11y) review

| Issue | Severity | Detail |
|-------|----------|--------|
| **No skip-navigation link** | ⚠️ Medium | Keyboard users must tab through all nav links on every page to reach content (see L4). |
| **Broken heading hierarchy** | 🔴 High | See P1. Incorrect `<h2>` usage inside `<article>` elements that are not sub-sections. |
| **Error messages need `role="alert"`** | ⚠️ Medium | The chat error `<p>` (line 116 in `DigitalTwinChat.tsx`) is not marked as a live region. Screen readers will not announce it when it appears. Add `role="alert"` or `aria-live="assertive"`. |
| **Loading state not announced** | ⚠️ Medium | The "Thinking…" bubble is visual only. Adding `aria-live="polite"` on the message list container would announce new messages to screen readers. |
| **"Placeholder Portfolio Link" is decorative** | ⚠️ Medium | `href="#"` (P3) would be read as "link, placeholder portfolio link" by a screen reader and then do nothing when activated. |
| **Focus ring** | 💡 Low | Tailwind removes default outlines (`outline-none` is used on the textarea). The custom `ring` style on focus is good, but the nav links and buttons rely on browser defaults for focus styling, which can vary or be hidden. Explicitly adding `focus-visible:ring` to all interactive elements ensures consistency. |
| **`<main>` is missing a landmark role label** | 💡 Low | The page `<main>` element could have `aria-label="Main content"` to make landmark navigation explicit. |

---

## 5. Performance review

| Issue | Severity | Detail |
|-------|----------|--------|
| **Unused Geist Mono font** | ⚠️ Medium | Network request and CSS variable for a font that is never applied (see L1). |
| **Knowledge base rebuilt per request** | ⚠️ Medium | `buildDigitalTwinKnowledgeBase()` called on every POST; should be module-level constant (see A4). |
| **No `next/image`** | 💡 Low | No images yet, but any future profile photo or project screenshot should use `next/image` for automatic optimisation, lazy loading, and WebP conversion. |
| **Large inline gradient class** | 💡 Low | The ~180-character radial-gradient string is repeated in JSX (see P6). Extracting to a CSS variable eliminates the inline string from the HTML. |
| **No `fetchpriority` / `preload` hints** | 💡 Low | Hero text is immediately visible; fonts are loaded via `next/font` (fine). When an image is added, marking it `priority` on `next/image` avoids LCP penalty. |

---

## 6. Git / project hygiene

| Issue | Severity | Detail |
|-------|----------|--------|
| **Uncommitted changes** | ⚠️ Medium | `git diff HEAD` shows 6 modified files not yet committed: `route.ts`, `globals.css`, `layout.tsx`, `page.tsx`, `DigitalTwinChat.tsx`, `careerProfile.ts`. These include all work since the "Save current progress" commit. Commit them before deploying. |
| **No `.env.example`** | ⚠️ Medium | Add a file like `.env.example` with the line `OPENROUTER_API_KEY=` (blank value) so collaborators or future setups know what to configure. |
| **`Profile (1).pdf` in git** | ⚠️ Medium | The LinkedIn PDF is tracked and contains personal contact info. Remove with `git rm "Profile (1).pdf"` and add `*.pdf` to `.gitignore`. |
| **`.gitignore` is minimal** | 💡 Low | Currently only ignores `.env`. Should also ignore: `.next/`, `node_modules/`, `*.pdf`, `*.log`, and platform files (`.DS_Store`, `Thumbs.db`). Note: `.next/` and `node_modules/` were generated by `create-next-app` which added a fuller `.gitignore` — check if that was overwritten. |
| **Commit messages** | 💡 Low | "Save current progress" and "Initial commit" are not descriptive. Conventional Commits style (`feat: add Digital Twin chat`, `fix: correct API header encoding`) would make the log meaningful when reading history. |
| **No `CONTRIBUTING.md` or `README`** | 💡 Low | The default `README.md` from `create-next-app` was kept (describes the scaffold, not the project). Update it to explain what the site is, how to run it locally, and what environment variables are needed. |

---

## 7. Remedial actions — priority order

Below is a recommended fix list, ordered **most urgent first**. All are actionable without breaking anything that currently works.

### 🔴 Must do before the site is public

1. **Add rate limiting to `/api/digital-twin`**  
   Without it a single bad actor can drain your OpenRouter quota in minutes. Minimum viable approach: Vercel's built-in Edge Middleware or a simple in-memory counter (works on a single instance). Preferred: `@upstash/ratelimit` with Upstash Redis — free tier available.

2. **Remove `Profile (1).pdf` from git history**  
   ```bash
   git rm "Profile (1).pdf"
   echo "*.pdf" >> .gitignore
   git add .gitignore
   git commit -m "chore: remove PDF from repo, ignore future PDFs"
   ```
   If the repo is ever made public, run `git filter-branch` or `git-filter-repo` to purge it from history.

3. **Fix heading hierarchy (`<h2>` in Education/Portfolio articles)**  
   The Education and Portfolio cards currently use `<h2>` which is fine only if the surrounding `<section>` has its own `<h2>` heading first. They should either be wrapped in labeled sections or use `<h3>` (since the page `<h1>` and section `<h2>` headings come before them in document order).

### ⚠️ Should do soon

4. **Commit all current work**  
   ```bash
   git add .
   git commit -m "feat: add nav, Digital Twin agent, Contact button improvements"
   ```

5. **Create `.env.example`**  
   ```env
   # Required: your OpenRouter API key
   OPENROUTER_API_KEY=
   # Optional: override the default model
   OPENROUTER_MODEL=
   # Optional: your deployed site URL for OpenRouter referer header
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

6. **Use `education` data from `careerProfile.ts` in `page.tsx`**  
   Remove the hard-coded education JSX and replace with `.map()` over `education`, as already done for `milestones`. Then the page and the AI knowledge base share exactly one version of the data.

7. **Hard-code email in footer → use `contact.email`**  
   Replace `jmclarke826@gmail.com` on line 179 of `page.tsx` with `{contact.email}` (import `contact` from `careerProfile`).

8. **Add `role="alert"` to the chat error message**  
   Change:  
   ```tsx
   <p className="... text-rose-300 ...">
     {error}
   </p>
   ```  
   To:  
   ```tsx
   <p role="alert" className="... text-rose-300 ...">
     {error}
   </p>
   ```

9. **Add request timeout to the OpenRouter `fetch`**  
   ```ts
   res = await fetch(OPENROUTER_URL, {
     signal: AbortSignal.timeout(30_000),
     // ...rest of options
   });
   ```

10. **Move `buildDigitalTwinKnowledgeBase()` result to module scope**  
    ```ts
    // at module level, called once on server startup
    const KNOWLEDGE_BASE = buildDigitalTwinKnowledgeBase();
    ```
    Then reference `KNOWLEDGE_BASE` inside the handler instead of calling the function per-request.

### 💡 Nice to have

11. **Add a skip-navigation link** as the very first child of `<body>` in `layout.tsx`:  
    ```tsx
    <a
      href="#about"
      className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:m-4 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900"
    >
      Skip to main content
    </a>
    ```

12. **Replace `href="#"` on the Portfolio placeholder** with a `<button disabled>` or `aria-disabled` span to prevent scroll-to-top and history pollution.

13. **Fix the `setTimeout` leak in `ContactButton`** (see CB1) by storing the return value and clearing on unmount with `useEffect`.

14. **Add `aria-live="polite"` to the chat message list** so screen readers announce new replies.

15. **Add `AbortController` to the `DigitalTwinChat` fetch** to cancel in-flight requests if the user navigates or sends a second message before the first responds.

16. **Remove the unused `Geist_Mono` font** from `layout.tsx` and its `--font-mono` token from `globals.css`.

17. **Update `README.md`** with project description, local setup steps, and required env vars.

18. **Add structured data / OG metadata** in `layout.tsx` for better social sharing and search visibility:
    ```ts
    export const metadata: Metadata = {
      title: "...",
      description: "...",
      openGraph: {
        title: "Jessica Clarke Dennis | Professional Profile",
        description: "...",
        url: "https://your-domain.com",
        type: "profile",
      },
    };
    ```

19. **Add `react-markdown` or similar** to `DigitalTwinChat` to render the AI's formatted responses (bullet points, bold text) properly.

20. **Add minimal server-side logging** (at minimum `console.error`) in the API route's catch blocks and on unexpected response shapes, so production incidents are diagnosable.

---

*This review was conducted by reading all source files and does not include runtime testing beyond what was already performed during development. No code was changed to produce this document.*
