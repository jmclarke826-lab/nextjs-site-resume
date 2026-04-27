import { ContactButton } from "@/components/ContactButton";

const navLinks = [
  { href: "#about", label: "About Me" },
  { href: "#experience", label: "Experience" },
  { href: "#agent", label: "Ask Me Agent" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/75">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 md:px-10">
        <a
          href="#about"
          className="shrink-0 text-sm font-semibold tracking-wide text-white transition hover:text-sky-200"
        >
          Jessica Clarke Dennis
        </a>

        <nav
          className="flex flex-wrap items-center gap-1 sm:flex-1 sm:justify-center sm:gap-2"
          aria-label="Primary"
        >
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70"
            >
              {label}
            </a>
          ))}
        </nav>

        <ContactButton className="shrink-0 rounded-full border border-sky-300/40 bg-sky-300/10 px-4 py-2 text-center text-sm font-medium text-sky-100 transition hover:border-sky-200 hover:bg-sky-300/20" />
      </div>
    </header>
  );
}
