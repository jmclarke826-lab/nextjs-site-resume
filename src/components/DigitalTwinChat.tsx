"use client";

import { useCallback, useRef, useState } from "react";

type Role = "user" | "assistant";

type ChatTurn = { role: Role; content: string };

const WELCOME: ChatTurn = {
  role: "assistant",
  content:
    "Hi — I am Jessica’s Digital Twin. Ask me about her operations background, billing experience, Crow & Lilac, clinic work, education, or what she is looking for next. I only answer from her public career profile.",
};

export function DigitalTwinChat() {
  const [messages, setMessages] = useState<ChatTurn[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    const userMsg: ChatTurn = { role: "user", content: text };
    const nextThread = [...messages, userMsg];
    setMessages(nextThread);
    setInput("");
    setLoading(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/digital-twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextThread.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof (data as { error?: string })?.error === "string"
            ? (data as { error: string }).error
            : `Request failed (${res.status}).`;
        throw new Error(msg);
      }
      const reply = (data as { message?: string }).message;
      if (typeof reply !== "string") {
        throw new Error("Invalid response from server.");
      }
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return (
    <section
      id="digital-twin"
      className="relative z-10 mt-16 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-[0_0_50px_-20px_rgba(168,85,247,0.35)] backdrop-blur md:p-8"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-200">
            Digital Twin
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
            Ask about Jessica’s career
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Powered by OpenRouter. Answers are grounded in the profile on this
            site — not live LinkedIn data.
          </p>
        </div>
      </div>

      <div className="mt-6 flex h-[min(28rem,55vh)] flex-col rounded-2xl border border-white/10 bg-slate-950/80">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-5">
          {messages.map((m, i) => (
            <div
              key={`${i}-${m.role}`}
              className={
                m.role === "user"
                  ? "ml-auto max-w-[90%] rounded-2xl rounded-br-md border border-sky-400/30 bg-sky-400/15 px-4 py-3 text-sm text-slate-100"
                  : "mr-auto max-w-[90%] rounded-2xl rounded-bl-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              }
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="mr-auto max-w-[90%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
              Thinking…
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <p className="border-t border-white/10 px-4 py-2 text-sm text-rose-300 md:px-5">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2 border-t border-white/10 p-3 md:flex-row md:items-end md:p-4">
          <label className="sr-only" htmlFor="digital-twin-input">
            Message
          </label>
          <textarea
            id="digital-twin-input"
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="e.g. What billing systems has she used?"
            className="min-h-[3rem] flex-1 resize-none rounded-xl border border-white/15 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none focus:ring-1 focus:ring-sky-400/40"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={loading || !input.trim()}
            className="shrink-0 rounded-xl bg-fuchsia-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
