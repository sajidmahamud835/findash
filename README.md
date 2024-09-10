# Findash - Financial Dashboard

Findash is a comprehensive financial dashboard that helps users track, analyze, and manage their financial data. The project leverages **Next.js**, **React**, **Tailwind CSS**, and **Drizzle ORM** with PostgreSQL for efficient data management and a user-friendly UI.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
  - [Using Bun](#using-bun)
  - [Using Node.js with TSX](#using-nodejs-with-tsx)
- [Scripts](#scripts)
- [License](#license)

## Features

- Real-time financial data tracking
- Visual financial insights with charts and graphs
- Expense and income management
- Investment portfolio tracking
- User authentication via Clerk
- Dark mode support

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Radix UI
- **Backend**: Drizzle ORM, PostgreSQL, Hono (for serverless functions)
- **Authentication**: Clerk
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Database**: PostgreSQL hosted on Neon.tech

## Installation

### Prerequisites

- **Node.js** (>= 18.0.0) or **Bun** (>= 1.0.0)
- **PostgreSQL** (or use a hosted solution like [Neon.tech](https://neon.tech))
- **Clerk Account** for authentication ([Clerk.dev](https://clerk.dev))

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/findash.git
   cd findash
   ```

2. Install dependencies:

   - Using Node.js:
     ```bash
     npm install
     ```

   - Using Bun:
     ```bash
     bun install
     ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables (see [Environment Variables](#environment-variables)).

   ```bash
   cp .env.example .env
   ```

## Environment Variables

You need to configure the following environment variables in a `.env` file:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
NEXT_PUBLIC_APP_URL=
```

- Get the Clerk keys from [Clerk's dashboard](https://dashboard.clerk.dev/).
- Get the database credentials from your PostgreSQL provider (e.g., Neon.tech).

## Running the Project

### Using Bun

If you prefer to use **Bun**, the project is already set up to work seamlessly with it.

1. Start the development server using Bun:

   ```bash
   bun run dev
   ```

2. For production builds:

   ```bash
   bun run build
   bun run start
   ```

3. Running Drizzle ORM database scripts with Bun:

   - Generate schema:
     ```bash
     bun run db:generate
     ```
   - Run migrations:
     ```bash
     bun run db:migrate
     ```
   - Seed the database:
     ```bash
     bun run db:seed
     ```

### Using Node.js with TSX

If you're using **Node.js** and want to execute TypeScript files, **TSX** is a great option.

1. Install TSX globally:
   ```bash
   npm install -g tsx
   ```

2. Modify the `package.json` to use `tsx` for running TypeScript scripts:

   ```json
   "scripts": {
     "db:migrate": "tsx ./scripts/migrate.ts",
     "db:seed": "tsx ./scripts/seed.ts"
   }
   ```

3. Run database scripts with Node.js using TSX:

   - Run migrations:
     ```bash
     npm run db:migrate
     ```
   - Seed the database:
     ```bash
     npm run db:seed
     ```

## Scripts

- `npm run dev` or `bun run dev`: Starts the development server.
- `npm run build` or `bun run build`: Builds the app for production.
- `npm run start` or `bun run start`: Starts the production server.
- `npm run lint` or `bun run lint`: Runs ESLint for code quality checks.
- `npm run format` or `bun run format`: Formats code using Prettier.
- `npm run db:generate` or `bun run db:generate`: Generates Drizzle ORM schema from PostgreSQL.
- `npm run db:migrate` or `bun run db:migrate`: Runs database migrations.
- `npm run db:seed` or `bun run db:seed`: Seeds the database.
- `npm run db:studio` or `bun run db:studio`: Opens Drizzle Studio for database inspection.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.