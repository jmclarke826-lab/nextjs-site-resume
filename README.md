# Jessica Clarke Dennis Professional Website

A polished Next.js personal website for Jessica Clarke Dennis. It includes a
career-focused homepage, smooth section navigation, contact controls, and an
OpenRouter-powered "Ask Me Agent" that answers questions from a curated career
profile.

## Getting Started

Install dependencies, then run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a local `.env` file in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openai/gpt-oss-120b:free
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Only `OPENROUTER_API_KEY` is required. See `.env.example` for the full list.

## Useful Commands

```bash
npm run dev      # start local development
npm run lint     # run ESLint
npm run build    # verify production build
npm run start    # run the production build
```

## Project Structure

- `src/app/page.tsx` - homepage sections and layout
- `src/app/layout.tsx` - global shell, metadata, top navigation
- `src/app/api/digital-twin/route.ts` - server-side OpenRouter API bridge
- `src/components/` - reusable UI components
- `src/data/careerProfile.ts` - career data used by both the page and agent
- `tutorial.md` - beginner walkthrough of the codebase
- `review.md` - code review and remedial action notes

## Deploy on Vercel

Add the same environment variables in Vercel project settings before deploying,
especially `OPENROUTER_API_KEY`.

Then deploy with your connected GitHub repository or the Vercel CLI.
