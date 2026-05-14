create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  name text not null,
  status text not null,
  description text,
  client_name text,
  start_date date,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_name_not_empty check (btrim(name) <> ''),
  constraint projects_status_check check (status in ('active', 'paused', 'completed', 'archived')),
  constraint projects_date_range_check check (due_date is null or start_date is null or due_date >= start_date)
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  name text not null,
  email text,
  company text,
  status text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clients_name_not_empty check (btrim(name) <> ''),
  constraint clients_status_check check (status in ('active', 'inactive', 'lead', 'archived'))
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  status text not null,
  priority text,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_title_not_empty check (btrim(title) <> ''),
  constraint tasks_status_check check (status in ('todo', 'in_progress', 'done', 'cancelled')),
  constraint tasks_priority_check check (priority is null or priority in ('low', 'medium', 'high', 'urgent'))
);

create table public.income_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  project_id uuid references public.projects(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  amount numeric not null,
  status text not null,
  due_date date,
  received_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint income_records_title_not_empty check (btrim(title) <> ''),
  constraint income_records_status_check check (status in ('pending', 'paid', 'overdue', 'cancelled')),
  constraint income_records_amount_non_negative check (amount >= 0)
);

create table public.workspace_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id),
  workspace_name text not null,
  preferred_currency text not null default 'TWD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workspace_settings_workspace_name_not_empty check (btrim(workspace_name) <> ''),
  constraint workspace_settings_preferred_currency_not_empty check (btrim(preferred_currency) <> '')
);
