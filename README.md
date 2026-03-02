# AuraAI Relationship Coach

Aplicativo fullstack (frontend React + TypeScript e backend Supabase) para apoiar casais com insights de relacionamento gerados por IA.

## Funcionalidades

- Login e cadastro com **Supabase Auth** (email/senha).
- Dashboard com histórico de análises de relacionamento por usuário.
- Interface moderna e responsiva com foco em UX.
- Suporte completo a **Português** e **English**.
- Persistência em tabelas do Supabase com RLS.
- Integração opcional com **Supabase Edge Function** para IA avançada.
- Dockerfile para rodar em qualquer dispositivo com Docker.

## Stack

- React 18 + TypeScript + Vite
- Supabase (Auth + Postgres + Edge Functions opcional)
- i18next para internacionalização (pt/en)

## 1) Como rodar localmente (sem Docker)

```bash
npm install
cp .env.example .env
# preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

Aplicação: `http://localhost:5173`

## 2) Como configurar o Supabase (passo a passo)

### 2.1 Criar projeto

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **New project**.
3. Após criar, abra **Project Settings > API** e copie:
   - `Project URL`
   - `anon public key`
4. Preencha no `.env`:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### 2.2 Configurar autenticação

1. Abra **Authentication > Providers > Email**.
2. Habilite Email/Password.
3. (Opcional) em **Authentication > URL Configuration**, configure a URL do seu domínio.

### 2.3 Criar tabelas necessárias

Abra **SQL Editor** no Supabase e execute:

```sql
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.relationship_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  suggestion text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.relationship_insights enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "insights_select_own"
on public.relationship_insights
for select
using (auth.uid() = user_id);

create policy "insights_insert_own"
on public.relationship_insights
for insert
with check (auth.uid() = user_id);
```

> Observação: o app grava perfil (`profiles`) após cadastro e grava histórico em `relationship_insights`.

### 2.4 (Opcional) IA real com Edge Function

O app tenta chamar a função `relationship-advice`. Se não existir, usa fallback local.

Exemplo de payload esperado:

```json
{
  "message": "texto do usuário",
  "locale": "pt"
}
```

Resposta esperada:

```json
{
  "suggestion": "sugestão gerada"
}
```

## 3) Rodar com Docker

### Build

```bash
docker build -t auraai-relationships .
```

### Run

```bash
docker run --rm -p 4173:4173 --env-file .env auraai-relationships
```

Aplicação: `http://localhost:4173`

## 4) Estrutura principal

- `src/App.tsx`: fluxo de autenticação, dashboard, integração Supabase e fallback/Edge Function de IA.
- `src/components/AuthForm.tsx`: tela de login/cadastro com validações.
- `src/components/Dashboard.tsx`: área logada para análises e histórico.
- `src/i18n.ts`: traduções pt/en.
- `src/lib/supabase.ts`: cliente Supabase.

## 5) Próximos passos recomendados

- Criar Edge Function com um provedor LLM (OpenAI, Anthropic, etc).
- Adicionar recuperação de senha e confirmação de email customizada.
- Criar testes E2E para autenticação e fluxo de insights.
