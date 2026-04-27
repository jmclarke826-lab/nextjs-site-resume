import { buildDigitalTwinKnowledgeBase } from "@/data/careerProfile";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-120b:free";
const KNOWLEDGE_BASE = buildDigitalTwinKnowledgeBase();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;
const UPSTREAM_TIMEOUT_MS = 30_000;

export const maxDuration = 60;
export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };
type RateLimitRecord = { count: number; resetAt: number };

const rateLimitStore = new Map<string, RateLimitRecord>();

function getClientId(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "local"
  );
}

function getRateLimitRetryAfterMs(clientId: string): number | null {
  const now = Date.now();
  const existing = rateLimitStore.get(clientId);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(clientId, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return null;
  }

  existing.count += 1;
  if (existing.count > RATE_LIMIT_MAX_REQUESTS) {
    return existing.resetAt - now;
  }

  if (rateLimitStore.size > 1000) {
    for (const [key, record] of rateLimitStore) {
      if (record.resetAt <= now) rateLimitStore.delete(key);
    }
  }

  return null;
}

function sanitizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  const out: ChatMessage[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: string }).role;
    const content = (item as { content?: string }).content;
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") continue;
    const trimmed = content.trim();
    if (!trimmed) continue;
    out.push({ role, content: trimmed.slice(0, 8000) });
  }
  return out.slice(-24);
}

/**
 * Some providers (including many OpenAI-compatible routes) require the
 * first message in the user/assistant thread to be from the user, not
 * a UI-only assistant welcome. Strip leading assistant turns.
 */
function stripLeadingAssistantThread(
  thread: ChatMessage[],
): ChatMessage[] {
  let i = 0;
  while (i < thread.length && thread[i]!.role === "assistant") {
    i += 1;
  }
  return thread.slice(i);
}

function openRouterErrorMessage(data: unknown, status: number): string {
  if (data && typeof data === "object" && "error" in data) {
    const err = (data as { error: unknown }).error;
    if (typeof err === "string" && err.trim()) return err.trim();
    if (err && typeof err === "object" && "message" in err) {
      const m = (err as { message?: unknown }).message;
      if (typeof m === "string" && m.trim()) return m.trim();
    }
  }
  return `OpenRouter request failed (${status}).`;
}

function extractAssistantText(data: unknown): string | null {
  const choice = (data as { choices?: unknown[] })?.choices?.[0];
  if (!choice || typeof choice !== "object") return null;

  const msg = (choice as { message?: { content?: unknown; text?: unknown } })
    .message;
  if (msg && typeof msg === "object" && "content" in msg) {
    const text = normalizeContent(
      (msg as { content: unknown }).content,
    );
    if (text.trim()) return text.trim();
  }

  const textOnly = (choice as { text?: unknown }).text;
  if (typeof textOnly === "string" && textOnly.trim()) {
    return textOnly.trim();
  }
  if (textOnly && typeof textOnly === "object") {
    const t = normalizeContent(textOnly);
    if (t.trim()) return t.trim();
  }

  return null;
}

function normalizeContent(content: unknown): string {
  if (content == null) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (!part || typeof part !== "object") return "";
        if ("text" in part && typeof (part as { text: string }).text === "string") {
          return (part as { text: string }).text;
        }
        if (
          "content" in part &&
          typeof (part as { content: string }).content === "string"
        ) {
          return (part as { content: string }).content;
        }
        return "";
      })
      .join("");
  }
  return "";
}

export async function POST(request: Request) {
  const retryAfterMs = getRateLimitRetryAfterMs(getClientId(request));
  if (retryAfterMs !== null) {
    return Response.json(
      {
        error:
          "Too many chat requests. Please wait a minute and try again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
        },
      },
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { error: "Server is not configured with OPENROUTER_API_KEY." },
      { status: 503 },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return Response.json(
      { error: "Expected application/json request body." },
      { status: 415 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rawMessages = (body as { messages?: unknown }).messages;
  const userThread = stripLeadingAssistantThread(sanitizeMessages(rawMessages));
  if (userThread.length === 0) {
    return Response.json(
      { error: "Provide a non-empty messages array with user or assistant roles." },
      { status: 400 },
    );
  }

  const system: ChatMessage = {
    role: "system",
    content: `You are a "Digital Twin" of Jessica Clarke Dennis: answer questions about her career, skills, experience, education, and goals using ONLY the knowledge below. If something is not covered, say clearly that the public profile does not include that detail and suggest contacting her via the email or LinkedIn listed. Be professional, concise, and accurate. Do not invent employers, dates, credentials, or metrics. You may speak in first person as Jessica when it feels natural.

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}`,
  };

  const model = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL;

  const payload = {
    model,
    messages: [system, ...userThread],
    temperature: 0.6,
    max_tokens: 1024,
  };

  let res: Response;
  try {
    res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
        "X-Title": "Jessica Clarke Dennis - Digital Twin",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Network error calling OpenRouter.";
    console.error("OpenRouter request failed", { message });
    return Response.json(
      {
        error:
          "The Digital Twin service is temporarily unavailable. Please try again shortly.",
      },
      { status: 502 },
    );
  }

  const raw = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    console.error("OpenRouter returned non-JSON response", {
      status: res.status,
      sample: raw.slice(0, 200),
    });
    return Response.json(
      { error: "Unexpected response from language model provider." },
      { status: 502 },
    );
  }

  if (!res.ok) {
    const message = openRouterErrorMessage(data, res.status);
    console.error("OpenRouter returned an error", {
      status: res.status,
      message,
    });
    return Response.json(
      {
        error:
          "The Digital Twin service could not complete that request. Please try again shortly.",
      },
      { status: res.status >= 400 && res.status < 600 ? res.status : 502 },
    );
  }

  const text = extractAssistantText(data);
  if (!text) {
    console.error("OpenRouter response did not include assistant text", {
      status: res.status,
      data,
    });
    return Response.json(
      {
        error:
          "Empty or unrecognized response from language model. Try again or set OPENROUTER_MODEL if this model is unavailable.",
      },
      { status: 502 },
    );
  }

  return Response.json({ message: text });
}
