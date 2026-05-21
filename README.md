# Memora AI 🤖💬

Memora AI is a sophisticated AI-powered monorepo project featuring a FastAPI backend and a Next.js frontend.

## 🏗 Architecture

```mermaid
graph TD
    subgraph Frontend
        A[Next.js App] --> B[React Components]
    end
    subgraph Backend
        C[FastAPI Server] --> D[AI Services]
        C --> E[Database]
    end
    subgraph Shared
        F[Shared Types/Models]
    end
    A -- REST/WS --> C
    F -- Imports --> A
    F -- Imports --> C
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+
- Python 3.12+
- Docker (optional)

### Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Set up environment variables:
    ```bash
    cp .env.example .env
    ```
4.  Run the development server:
    ```bash
    pnpm dev
    ```

## 🛠 Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Backend**: FastAPI (Python)
- **Frontend**: Next.js (TypeScript, Tailwind CSS)
- **AI**: OpenAI API
- **Database**: Supabase / PostgreSQL
- **Linting**: Ruff, Black, ESLint, Prettier
