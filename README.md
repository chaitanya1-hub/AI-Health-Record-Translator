# AI Health Record Translator

An AI assistant that translates lab reports into plain language, flags abnormal values, suggests questions for the doctor, tracks health changes over time, and answers follow-up questions.

---

## Project Structure

This repository is organized into distinct **Frontend (Client)** and **Backend (Server)** directories:

```text
├── client/                     # Frontend Application (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # HealthScoreCard, AbnormalValuesList, ReportSummary, etc.
│   │   ├── pages/              # Dashboard, ReportDetail, History, Login
│   │   ├── hooks/              # Custom React hooks (useAuth, useReports)
│   │   ├── context/            # AuthContext provider
│   │   └── lib/                # Supabase JS client & Medical API services
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json             # Vercel deployment rewrites
│
├── server/                     # Backend & Database Architecture (Supabase)
│   ├── supabase/
│   │   ├── schema.sql          # Postgres DDL schema (Tables, RLS policies, Indexes)
│   │   └── functions/          # Deno Edge Functions
│   │       ├── process-report/ # Structured LLM medical report extraction
│   │       └── qa-chat/        # Report-grounded AI conversational Q&A
│   └── package.json
│
├── .env.example                # Environment configuration template
└── README.md
```

---

## 🚀 Running Locally

### 1. Frontend (Client)
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend (Server & Database)
- **Supabase Database DDL**: Execute [server/supabase/schema.sql](file:///c:/Users/Maddi%20chaitanya%20sai/AI%20health%20record%20translator/server/supabase/schema.sql) in your Supabase SQL Editor.
- **Edge Functions**: Deploy functions using Supabase CLI:
  ```bash
  cd server
  supabase functions deploy process-report
  supabase functions deploy qa-chat
  ```
