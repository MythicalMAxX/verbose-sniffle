# Next.js 14 Starter

This is a starter project with the following stack:

- [Next.js 14](https://nextjs.org) (App Router)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)
- [React Query](https://tanstack.com/query/latest)
- [Next Themes](https://github.com/pacocoursey/next-themes)
- [Vitest](https://vitest.dev)

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Lint code
- `npm run type-check`: Check types
- `npm run test`: Run tests
- `npm run prisma:migrate`: Create/apply migrations locally (development)
- `npm run prisma:migrate:deploy`: Apply migrations in production (no prompts)
- `npm run prisma:seed`: Seed the database with demo data
- `npm run prisma:studio`: Open Prisma Studio

## Prisma (Postgres)

This project uses Prisma ORM with PostgreSQL.

### Local setup

1. Start a local Postgres instance.
2. Update `prisma/.env` (or set `DATABASE_URL`/`DIRECT_URL` in your shell) to point at your database.
3. Run:

```bash
npm run prisma:migrate
npm run prisma:seed
```

### Deploying on Vercel

- Use `npm run prisma:migrate:deploy` (or `npx prisma migrate deploy`) against your production database.
- If you're using **Prisma Accelerate / Data Proxy**:
  - Set `DATABASE_URL` to your `prisma://...` Accelerate URL (used by Prisma Client at runtime).
  - Set `DIRECT_URL` to your direct `postgresql://...` connection string (used for migrations).

Seeding is typically a one-time operation; you can run `npx prisma db seed` manually when needed.

## Environment Variables

See `.env.example`.
