# A Beginner’s Guide to This Next.js Personal Site

This document explains how this project is built, in plain language. You do **not** need prior experience with React or TypeScript, though basic familiarity with a text editor and the idea of a “folder of files” helps.

---

## 1. What’s in the stack? (technology summary)

| Technology | What it is (in one sentence) |
|------------|------------------------------|
| **Next.js** | A **React** framework: it gives you file-based **routes**, a **dev server**, and a way to build a fast site for production. |
| **React** | A **JavaScript library** for UIs. You build **components** (reusable pieces) that **render** to HTML in the browser. |
| **TypeScript** | **JavaScript with types** (e.g. “this is always a string”), which helps catch mistakes while you edit. |
| **Tailwind CSS** | **Utility classes** in your HTML/JSX (e.g. `flex`, `p-4`, `text-white`) instead of writing large separate CSS files. |
| **ESLint** | A **linter** that checks your code for common issues and project rules. |
| **OpenRouter (via API route)** | The **“Digital Twin”** chat does **not** call the AI from the browser. It calls a **server-only** path that sends your data to [OpenRouter](https://openrouter.ai/) with a **secret key** kept on the server. |

**Important idea:** anything that needs a **secret** (like `OPENROUTER_API_KEY`) must run **on the server** (here: `src/app/api/...`). The browser only talks to your own site’s API URL (`/api/digital-twin`).

### Main folders in this project

- `src/app/` — **App Router** pages, layout, and global styles.
- `src/app/api/` — **API routes** (server code that the browser can call with `fetch`).
- `src/components/` — Reusable UI pieces (header, chat, contact button).
- `src/data/` — Shared **data** and helpers (career text for the page *and* for the AI context).
- `.env` (local, not committed) — **Secrets** like the OpenRouter key. `git` should ignore it via `.gitignore`.

### Commands you will use

```bash
npm run dev     # start local dev server (usually http://localhost:3000)
npm run build   # production build (checks that everything compiles)
npm run start   # run production server after a build
npm run lint    # run ESLint
```

---

## 2. High-level walkthrough: what happens when someone visits the site?

1. The browser requests your **home page** route: `/`.
2. **Next.js** matches that to the file `src/app/page.tsx` and wraps it in `src/app/layout.tsx`.
3. **Layout** always wraps the page. Here it:
   - Loads **fonts** (Geist) and **global CSS** (`globals.css`),
   - Sets **page title and description** (SEO),
   - Renders a **top navigation** (`SiteHeader`) above the page content.
4. The **home page** (`page.tsx`) shows:
   - A styled **“about”** section,
   - **Experience** (a list of jobs from data),
   - **Digital Twin** chat (a **client** component that can update when you type),
   - **Education** and a **portfolio** placeholder, then a **footer**.
5. When the user **sends a message** in the chat, the **browser** runs `fetch("/api/digital-twin", { ... })` to **your server**.
6. The **API route** (`route.ts`):
   - Reads `process.env.OPENROUTER_API_KEY` (the key never goes to the browser),
   - Builds a **system prompt** + your career text from `careerProfile.ts`,
   - Calls OpenRouter’s **chat completion** endpoint,
   - Returns a JSON object like `{ "message": "..." }` to the page,
   - The chat UI appends the assistant’s reply to the on-screen list.

6. The **Contact** area uses a **mailto** link, plus a **Copy email** button for machines where `mailto:` does not open a mail app (common on Windows without a default client).

That’s the whole pipeline: **Layout → Page → (optional) Client components → API route → third-party AI**.

---

## 3. File-by-file review (with code samples)

### 3.1 `src/app/layout.tsx` — the shell that wraps every page

The **Root Layout** must export a default component that includes `<html>` and `<body>`. Here it also:

- applies **font variables** to `<html>`,  
- includes **`SiteHeader`** (navigation + contact) on all pages,  
- wraps the **page** in a flex child so the footer and main can grow.

```tsx
// Simplified (see full file in repo for exact code)
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="...font variables...">
      <body className="flex min-h-full flex-col bg-slate-950">
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
```

**Beginner note:** `children` is “whatever the current page wants to show.” For `/`, that is the content of `page.tsx`.

---

### 3.2 `src/app/page.tsx` — the homepage

The home file exports a default **React component** that returns one big **`<main>`** with your sections. Important patterns:

- **`id="about"`**, **`id="experience"`** — so links like `href="#about"` can scroll to a section.
- **`scroll-mt-24`** (Tailwind) — top margin when scrolling with a **fixed/sticky** header, so the heading is not hidden under the bar.
- **`<DigitalTwinChat />`** — a separate component, imported at the top.
- **`.map(...)`** over `milestones` — a JavaScript way to “for each item in a list, render a card,” without pasting the same HTML seven times.

```tsx
import { DigitalTwinChat } from "@/components/DigitalTwinChat";
import { milestones } from "@/data/careerProfile";

export default function Home() {
  return (
    <main className="relative overflow-hidden ...">
      <section id="about" className="scroll-mt-24 ...">
        {/* intro + strengths grid */}
      </section>

      <section id="experience" className="... scroll-mt-24 ...">
        <h2>Career Journey</h2>
        {milestones.map((item) => (
          <article key={`${item.company}-${item.period}`}>
            <h3>{item.role} - {item.company}</h3>
            <p>{item.impact}</p>
          </article>
        ))}
      </section>

      <DigitalTwinChat />
      {/* education, portfolio, footer */}
    </main>
  );
}
```

**Import path note:** The `@/` prefix is configured in `tsconfig.json` to mean `src/`, so `@/data/careerProfile` is `src/data/careerProfile`.

---

### 3.3 `src/app/globals.css` — site-wide styles

Tailwind is **imported** at the top. A few custom rules set **smooth scrolling** and respect users who prefer **reduced motion** (accessibility).

```css
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

---

### 3.4 `src/components/SiteHeader.tsx` — top navigation

This is a **server component** (no `"use client"`) because it only renders **static links** (`<a href="#about">`).

- **Sticky** header: `sticky top-0 z-50` so it stays visible when you scroll.
- **`<ContactButton />`** is a **client** child: Next.js allows server layouts to import client components; they get a “client island.”

```tsx
import { ContactButton } from "@/components/ContactButton";

const navLinks = [
  { href: "#about", label: "About Me" },
  { href: "#experience", label: "Experience" },
  { href: "#agent", label: "Ask Me Agent" },
];

// Renders: brand link, then nav, then <ContactButton ... />
```

---

### 3.5 `src/components/ContactButton.tsx` — “Contact” and “Copy email”

The first line is **`"use client"`** because it uses **React state** (`useState`) and the **Clipboard API** (`navigator.clipboard`), which only run in the **browser**.

```tsx
"use client";

import { useState } from "react";
import { contact } from "@/data/careerProfile";

export function ContactButton({ className }) {
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent("Inquiry from your website")}`;

  const copy = async () => {
    await navigator.clipboard.writeText(contact.email);
    // show "Copied" for a second, etc.
  };

  return (
    <div>
      <a href={mailto} className={className}>Contact</a>
      <button type="button" onClick={() => void copy()}>Copy email</button>
    </div>
  );
}
```

**Why a button?** `mailto:` does not open an app on every OS. Copying the address is a **reliable** fallback.

---

### 3.6 `src/components/DigitalTwinChat.tsx` — the chat UI

Also **`"use client"`** because the chat must **remember**:

- the **messages** list,
- the **input** value,
- **loading** and **error** state.

`useState` stores that. `fetch` is called when the user hits **Send**.

```tsx
"use client";

import { useState } from "react";

export function DigitalTwinChat() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi — ..." }]);
  const [input, setInput] = useState("");

  const send = async () => {
    const res = await fetch("/api/digital-twin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: /* current thread */ }),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    // append data.message to messages
  };

  return <section id="agent">…</section>;
}
```

The `id="agent"` matches the **Ask Me Agent** link in the header.

---

### 3.7 `src/data/careerProfile.ts` — one source of truth

This file exports **structured data** (arrays and strings) and a function **`buildDigitalTwinKnowledgeBase()`** that flattens it into a **long text block** for the AI’s **system context**.

- **`milestones`** — used by the home page to render job cards and by the knowledge builder for the agent.
- **`contact.email`** — used by the header and (optionally) anywhere else, so you only change the email in one place.

```ts
export const milestones: Milestone[] = [
  { role: "Owner & Operations", company: "Crow & Lilac", /* ... */ },
  // ...
];

export function buildDigitalTwinKnowledgeBase(): string {
  const experience = milestones
    .map((m) => `- ${m.role} at ${m.company}: ${m.impact}`)
    .join("\n");
  return `
Name: ...
Experience:
${experience}
`.trim();
}
```

---

### 3.8 `src/app/api/digital-twin/route.ts` — the secure AI bridge

This file exports a **`POST` handler** (not a React component). Every file named `route.ts` under `app/api/` becomes an HTTP API route for that path.

**Flow:**

1. **Read the API key** from the environment. If it is missing, return **503** and a clear error.
2. **Parse** the JSON body (`{ messages: [...] }`) from the client.
3. **Sanitize** messages (only `user` and `assistant`, length limits) and **remove leading assistant** messages (e.g. the on-screen “welcome” line) so the provider receives a **valid** thread starting with a **user** turn where required.
4. **Prepend a `system` message** that contains your career text and “answer only from this” instructions.
5. **`fetch(OPENROUTER_URL, { ... })`** with `Authorization: Bearer <key>`.
6. **Parse the response** — some models return `message.content` as a **string** or as an **array of parts**; the code **normalizes** that into a single string.
7. **Return** `{ "message": "..." }` to the client.

Simplified **shape** (the real file has more helpers):

```ts
import { buildDigitalTwinKnowledgeBase } from "@/data/careerProfile";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-120b:free";

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    return Response.json({ error: "Server is not configured with OPENROUTER_API_KEY." }, { status: 503 });
  }

  const body = await request.json();
  const userThread = /* sanitize + strip leading assistant */;
  const system = { role: "system", content: "..." + buildDigitalTwinKnowledgeBase() };
  const model = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL;

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages: [system, ...userThread] }),
  });

  // parse JSON, extract text, return Response.json({ message: text })
}
```

**Environment variables (local):** create a file `.env` in the project **root** (do **not** commit it) with at least:

```env
OPENROUTER_API_KEY=sk-or-v1-...
```

**Deployment:** set the same variable in your host’s dashboard (e.g. Vercel → Project → Settings → Environment Variables), then **redeploy**.

**Optional override:** you can set `OPENROUTER_MODEL` if the default free model is unavailable; the code uses `process.env.OPENROUTER_MODEL` or falls back to the default.

---

## 4. How the request flows (diagram in words)

1. **Browser** (React) → `POST /api/digital-twin` with JSON `{ messages }`.  
2. **Next.js server** runs `POST` in `route.ts`.  
3. **OpenRouter** returns JSON with a **completion**.  
4. **API route** returns `{ message: "…" }` to the browser.  
5. **Chat component** appends the message to the list in **state** → the screen re-renders with the new line.

The **OpenRouter key** only exists in **step 2–3** on the server. The browser **never** sees it.

---

## 5. Five ways this project could be improved (self-review)

1. **Content management (CMS or Markdown)**  
   Today, resume text lives in `careerProfile.ts` and `page.tsx`. Moving copy to **Markdown** files or a **headless CMS** would let you update wording without editing code, and you could still feed the same text into `buildDigitalTwinKnowledgeBase()`.

2. **Streaming responses for the agent**  
   The API currently waits for the **full** reply, then returns JSON. OpenRouter supports **streaming** tokens; you could use **Server-Sent Events** or a **streaming** Next.js response so the user sees the answer type out (better perceived performance).

3. **Tests**  
   Add **unit tests** for `sanitizeMessages`, `stripLeadingAssistantThread`, and `extractAssistantText` (pure functions) and a small **E2E** test (e.g. Playwright) that loads the home page and checks that an anchor link scrolls to the right `id`. That would catch regressions when you change dependencies.

4. **Rate limiting and abuse protection**  
   The chat endpoint is **public** to anyone who can hit your site. Adding **per-IP rate limits**, a **CAPTCHA** on heavy use, or a **signed session** would reduce bill shock and automated spam.

5. **Performance and a11y polish**  
   You could add **`next/image`** for a future profile photo, audit **contrast** and **focus** styles for keyboard users, and lazy-load a heavy sub-component if the page grows. A **sitemap** and **OpenGraph** images in `metadata` would help when the site is shared on social media.

---

## 6. Quick glossary

- **Component** — A function that returns **JSX** (HTML-like tags inside JavaScript) and can take **props** (inputs).
- **Client component** — Marked with `"use client"`; can use `useState`, `useEffect`, and browser-only APIs.
- **Server component** — Default in the App Router; good for data that can render on the server; cannot use browser-only hooks directly.
- **JSX** — Syntax extension: `<div>Hello</div>` inside a `.tsx` file.
- **API route** — A function tied to a **URL** under your domain (e.g. `/api/digital-twin`).

---

*This tutorial describes the project structure as of the time it was written. File contents may have changed; always read the source files in your repo for the exact current version.*
