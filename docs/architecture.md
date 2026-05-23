# System Architecture

Memora AI is built as a monorepo with a decoupled frontend and backend.

## Components
- **Frontend**: Next.js 15 application using React Server Components and Supabase SSR.
- **Backend**: FastAPI server providing AI services and database management.
- **Database**: PostgreSQL with `pgvector` for similarity search on professional memories.
- **AI Layer**: OpenAI-powered agents for reflection and matching.
