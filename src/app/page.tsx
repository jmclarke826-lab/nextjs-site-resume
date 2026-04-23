import { DigitalTwinChat } from "@/components/DigitalTwinChat";
import { milestones } from "@/data/careerProfile";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(168,85,247,0.2),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(14,165,233,0.16),transparent_40%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-16 pt-10 md:px-10">
        <header className="relative z-10 mb-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
              Jessica Clarke Dennis
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Operations & Administration Professional
            </p>
          </div>
          <a
            href="mailto:jmclarke826@gmail.com"
            className="rounded-full border border-sky-300/40 bg-sky-300/10 px-5 py-2 text-sm font-medium text-sky-100 transition hover:border-sky-200 hover:bg-sky-300/20"
          >
            Contact
          </a>
        </header>

        <section className="relative z-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_-25px_rgba(14,165,233,0.6)] backdrop-blur">
            <p className="mb-6 inline-flex rounded-full border border-fuchsia-300/50 bg-fuchsia-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-200">
              Enterprise Meets Edgy
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
              Turning complex operations into calm, reliable execution.
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-slate-300">
              I am an operations and administration professional with 15+ years
              of experience across wellness clinics, medical billing, and small
              business ownership. I specialize in building practical systems,
              closing communication loops, and creating stable day-to-day
              operations across customers, vendors, and internal teams.
            </p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-400">
              Open to remote, hybrid, and San Diego-area opportunities in
              operations, office management, medical billing, and customer success.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://www.linkedin.com/in/jessica-clarke-dennis-762a5321a"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                View LinkedIn
              </a>
              <a
                href="#portfolio"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10"
              >
                Explore Portfolio Vision
              </a>
              <a
                href="#digital-twin"
                className="rounded-full border border-fuchsia-300/30 px-6 py-3 text-sm font-semibold text-fuchsia-100 transition hover:border-fuchsia-200/60 hover:bg-fuchsia-500/10"
              >
                Chat with Digital Twin
              </a>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <h2 className="text-lg font-semibold text-white">Core Strengths</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                One-on-one instruction and client support
              </li>
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                Applied Behavior Analysis (ABA)
              </li>
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                Child development and behavior-focused communication
              </li>
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                Revenue cycle and medical billing operations
              </li>
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                SOP creation, inventory control, and process ownership
              </li>
            </ul>
          </aside>
        </section>

        <section className="relative z-10 mt-16">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Career Journey
          </h2>
          <div className="mt-8 space-y-5">
            {milestones.map((item) => (
              <article
                key={`${item.company}-${item.period}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-white">
                    {item.role} - {item.company}
                  </h3>
                  <p className="text-sm font-medium text-sky-200">{item.period}</p>
                </div>
                <p className="mt-1 text-sm uppercase tracking-wider text-slate-400">
                  {item.location}
                </p>
                <p className="mt-4 text-slate-300">{item.impact}</p>
              </article>
            ))}
          </div>
        </section>

        <DigitalTwinChat />

        <section className="relative z-10 mt-16 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
            <h2 className="text-xl font-semibold text-white">Education</h2>
            <div className="mt-4 space-y-4 text-slate-300">
              <p>
                <span className="font-semibold text-white">
                  Binghamton University
                </span>
                <br />
                Bachelor of Science (BS), Psychology
                <br />
                September 2005 - June 2007
              </p>
              <p>
                <span className="font-semibold text-white">
                  Hudson Valley Community College
                </span>
                <br />
                Associate&apos;s Degree, Liberal Arts and Sciences/Liberal Studies
                <br />
                August 2003 - June 2005
              </p>
            </div>
          </article>

          <article
            id="portfolio"
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"
          >
            <h2 className="text-xl font-semibold text-white">
              Portfolio (Coming Soon)
            </h2>
            <p className="mt-4 text-slate-300">
              This section is ready for future case studies: operations turnarounds,
              workflow redesigns, billing outcomes, and customer experience wins.
            </p>
            <a
              href="#"
              className="mt-5 inline-block rounded-full border border-fuchsia-300/40 bg-fuchsia-300/10 px-5 py-2 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-300/20"
            >
              Placeholder Portfolio Link
            </a>
          </article>
        </section>

        <footer className="relative z-10 mt-16 border-t border-white/10 pt-7 text-sm text-slate-400">
          <p>
            Based in San Diego, California - Open to meaningful collaborations and
            next-step opportunities.
          </p>
          <p className="mt-2">
            Email:{" "}
            <a
              className="text-sky-300 hover:text-sky-200"
              href="mailto:jmclarke826@gmail.com"
            >
              jmclarke826@gmail.com
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
