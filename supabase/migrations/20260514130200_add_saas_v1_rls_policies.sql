alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.clients enable row level security;
alter table public.income_records enable row level security;
alter table public.workspace_settings enable row level security;

create policy "Users can select own projects"
on public.projects
for select
using (auth.uid() = user_id);

create policy "Users can insert own projects"
on public.projects
for insert
with check (auth.uid() = user_id);

create policy "Users can update own projects"
on public.projects
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own projects"
on public.projects
for delete
using (auth.uid() = user_id);

create policy "Users can select own tasks"
on public.tasks
for select
using (auth.uid() = user_id);

create policy "Users can insert own tasks"
on public.tasks
for insert
with check (auth.uid() = user_id);

create policy "Users can update own tasks"
on public.tasks
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own tasks"
on public.tasks
for delete
using (auth.uid() = user_id);

create policy "Users can select own clients"
on public.clients
for select
using (auth.uid() = user_id);

create policy "Users can insert own clients"
on public.clients
for insert
with check (auth.uid() = user_id);

create policy "Users can update own clients"
on public.clients
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own clients"
on public.clients
for delete
using (auth.uid() = user_id);

create policy "Users can select own income records"
on public.income_records
for select
using (auth.uid() = user_id);

create policy "Users can insert own income records"
on public.income_records
for insert
with check (auth.uid() = user_id);

create policy "Users can update own income records"
on public.income_records
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own income records"
on public.income_records
for delete
using (auth.uid() = user_id);

create policy "Users can select own workspace settings"
on public.workspace_settings
for select
using (auth.uid() = user_id);

create policy "Users can insert own workspace settings"
on public.workspace_settings
for insert
with check (auth.uid() = user_id);

create policy "Users can update own workspace settings"
on public.workspace_settings
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own workspace settings"
on public.workspace_settings
for delete
using (auth.uid() = user_id);
