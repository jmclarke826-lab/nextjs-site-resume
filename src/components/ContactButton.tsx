"use client";

import { useEffect, useRef, useState } from "react";
import { contact } from "@/data/careerProfile";

const subject = "Inquiry from your website";

/**
 * `mailto:` does nothing on many systems without a default mail app.
 * The Copy button is a reliable fallback; full address is in title/ARIA.
 */
export function ContactButton({ className }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "err">("idle");
  const timeoutRef = useRef<number | null>(null);
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`;

  const scheduleReset = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setStatus("idle"), 2000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = async () => {
    if (!navigator.clipboard?.writeText) {
      setStatus("err");
      scheduleReset();
      return;
    }
    try {
      await navigator.clipboard.writeText(contact.email);
      setStatus("copied");
      scheduleReset();
    } catch {
      setStatus("err");
      scheduleReset();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 sm:shrink-0">
      <a
        href={mailto}
        className={className}
        rel="noreferrer"
        title={contact.email}
      >
        Contact
      </a>
      <button
        type="button"
        onClick={() => void copy()}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70"
        title={contact.email}
        aria-label={`Copy email address ${contact.email} to clipboard`}
      >
        {status === "copied" ? "Copied" : "Copy email"}
      </button>
      {status === "err" && (
        <span
          className="w-full text-right text-xs text-amber-200/90"
          role="status"
        >
          Could not copy — your browser blocked clipboard access
        </span>
      )}
    </div>
  );
}
