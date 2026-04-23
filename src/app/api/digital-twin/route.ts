import { buildDigitalTwinKnowledgeBase } from "@/data/careerProfile";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b:free";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

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
    if (trimmed.length > 8000) continue;
    out.push({ role, content: trimmed.slice(0, 8000) });
  }
  return out.slice(-24);
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { error: "Server is not configured with OPENROUTER_API_KEY." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rawMessages = (body as { messages?: unknown }).messages;
  const userThread = sanitizeMessages(rawMessages);
  if (userThread.length === 0) {
    return Response.json(
      { error: "Provide a non-empty messages array with user or assistant roles." },
      { status: 400 },
    );
  }

  const knowledge = buildDigitalTwinKnowledgeBase();
  const system: ChatMessage = {
    role: "system",
    content: `You are a "Digital Twin" of Jessica Clarke Dennis: answer questions about her career, skills, experience, education, and goals using ONLY the knowledge below. If something is not covered, say clearly that the public profile does not include that detail and suggest contacting her via the email or LinkedIn listed. Be professional, concise, and accurate. Do not invent employers, dates, credentials, or metrics. You may speak in first person as Jessica when it feels natural.

KNOWLEDGE BASE:
${knowledge}`,
  };

  const payload = {
    model: MODEL,
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
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Network error calling OpenRouter.";
    return Response.json(
      { error: `Could not reach OpenRouter: ${message}` },
      { status: 502 },
    );
  }

  const raw = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return Response.json(
      { error: "Unexpected response from language model provider." },
      { status: 502 },
    );
  }

  if (!res.ok) {
    const message =
      typeof (data as { error?: { message?: string } })?.error?.message ===
      "string"
        ? (data as { error: { message: string } }).error.message
        : `OpenRouter request failed (${res.status}).`;
    return Response.json({ error: message }, { status: res.status >= 400 && res.status < 600 ? res.status : 502 });
  }

  const choice = (data as { choices?: { message?: { content?: string } }[] })
    ?.choices?.[0]?.message?.content;
  if (typeof choice !== "string" || !choice.trim()) {
    return Response.json(
      { error: "Empty response from language model." },
      { status: 502 },
    );
  }

  return Response.json({ message: choice.trim() });
}
