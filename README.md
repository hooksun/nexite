# Nexite

A personal project built to demonstrate my current frontend engineering skills, with a focus on reusable, well-engineered components.

**[Live Demo](https://nexite-black.vercel.app/)**

## Tech Stack

- **[Next.js](https://nextjs.org/)** (App Router) — built with TypeScript and Tailwind CSS. Leverages Next.js-specific features such as Server-Side Rendering and Server Actions to optimize performance.
- **[Supabase](https://supabase.com/)** — used for database and authentication, with RLS policies enforced to secure data access. Utilizes Supabase SSR to call APIs server-side, keeping API keys hidden from the browser.
- **[shadcn](https://ui.shadcn.com/)** (Base UI) — used as the foundation for custom components, selected and configured with accessibility in mind.
- **[React Hook Form](https://react-hook-form.com/)** — used to build customizable forms, leveraging features like `Controller` and `useWatch` to minimize unnecessary re-renders.

## Features

- **Polymorphic form field component** — supports multiple customizable field types and validation rules through a single, reusable interface.
- **Reusable data table** — sortable, filterable, and paginated, powered by a custom query builder built on top of the Supabase JS client, with URL-synced state and support for aggregate queries.
- **Authentication** — implemented with Supabase RLS, including support for anonymous accounts so users can try the app without signing up.

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- A [Supabase](https://supabase.com/) project

### Setup

1. Clone the repository

   ```bash
   git clone https://github.com/hooksun/nexite.git
   cd nexite
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root with the following variables:

   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   ```

4. Generate your Supabase types and place the output in `lib/supabase/supabase-types.ts`:

   ```bash
   npx supabase login
   npx supabase init
   npx supabase gen types typescript --project-id your-project-id --schema public > lib/supabase/supabase-types.ts
   ```

5. Run the development server

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

This project is licensed under the [MIT License](LICENSE).
