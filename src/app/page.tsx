import { DigitalTwinChat } from "@/components/DigitalTwinChat";
import {
  contact,
  education,
  milestones,
  officeStrengths,
} from "@/data/careerProfile";

export default function Home() {
  return (
    <main
      aria-label="Main content"
      className="relative overflow-hidden bg-slate-950 text-slate-100"
    >
      <div className="ambient-background pointer-events-none absolute inset-0" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-16 pt-8 md:px-10 md:pt-10">
        <section
          id="about"
          className="relative z-10 scroll-mt-24 md:scroll-mt-28"
          aria-labelledby="about-heading"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
            Operations & Administration Professional
          </p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_-25px_rgba(14,165,233,0.6)] backdrop-blur">
              <p className="mb-6 inline-flex rounded-full border border-fuchsia-300/50 bg-fuchsia-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-200">
                Enterprise Meets Edgy
              </p>
              <h1
                id="about-heading"
                className="text-4xl font-semibold leading-tight text-white md:text-6xl"
              >
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
                  href={contact.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
                >
                  View LinkedIn
                </a>
                <a
                  href="#portfolio"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70"
                >
                  Explore Portfolio Vision
                </a>
                <a
                  href="#agent"
                  className="rounded-full border border-fuchsia-300/30 px-6 py-3 text-sm font-semibold text-fuchsia-100 transition hover:border-fuchsia-200/60 hover:bg-fuchsia-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/70"
                >
                  Ask Me Agent
                </a>
              </div>
            </div>

            <aside className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
              <h2 className="text-lg font-semibold text-white">Core Strengths</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {officeStrengths.map((strength) => (
                  <li
                    key={strength}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    {strength}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section
          id="experience"
          className="relative z-10 mt-16 scroll-mt-24 md:scroll-mt-28"
          aria-labelledby="experience-heading"
        >
          <h2
            id="experience-heading"
            className="text-2xl font-semibold text-white md:text-3xl"
          >
            Career Journey
          </h2>
          <div className="mt-8 space-y-5">
            {milestones.map((item) => (
              <article
                key={`${item.company}-${item.role}-${item.period}`}
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

        <section
          className="relative z-10 mt-16"
          aria-labelledby="credentials-heading"
        >
          <h2 id="credentials-heading" className="sr-only">
            Credentials and Portfolio
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
            <h3 className="text-xl font-semibold text-white">Education</h3>
            <div className="mt-4 space-y-4 text-slate-300">
              {education.map((item) => (
                <p key={item.school}>
                  <span className="font-semibold text-white">{item.school}</span>
                  <br />
                  {item.detail}
                </p>
              ))}
            </div>
          </article>

          <article
            id="portfolio"
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"
          >
            <h3 className="text-xl font-semibold text-white">
              Portfolio (Coming Soon)
            </h3>
            <p className="mt-4 text-slate-300">
              This section is ready for future case studies: operations turnarounds,
              workflow redesigns, billing outcomes, and customer experience wins.
            </p>
            <span
              aria-disabled="true"
              className="mt-5 inline-block rounded-full border border-fuchsia-300/40 bg-fuchsia-300/10 px-5 py-2 text-sm font-semibold text-fuchsia-100"
            >
              Placeholder Portfolio Link
            </span>
          </article>
          </div>
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
              href={`mailto:${contact.email}`}
            >
              {contact.email}
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
