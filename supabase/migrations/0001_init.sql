-- MedRep: profili, amicizie, classifica reale.
-- Eseguire questo script nel SQL editor del progetto Supabase.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  avatar_emoji text not null default '🧑‍⚕️',
  avatar_url text,
  xp integer not null default 0,
  weekly_xp integer not null default 0,
  week_start date not null default date_trunc('week', now())::date,
  created_at timestamptz not null default now()
);

create table public.friendships (
  user_id uuid not null references public.profiles (id) on delete cascade,
  friend_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);

create index friendships_friend_id_idx on public.friendships (friend_id);

-- Crea automaticamente il profilo al primo accesso Google.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'picture'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Incremento XP server-side: unico modo per modificare xp/weekly_xp, evita
-- che il client scriva valori arbitrari direttamente sulla riga.
create function public.add_xp(amount integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  monday date := date_trunc('week', now())::date;
begin
  if amount <= 0 or amount > 50 then
    raise exception 'invalid xp amount';
  end if;

  update public.profiles
  set
    xp = xp + amount,
    weekly_xp = case when week_start <> monday then amount else weekly_xp + amount end,
    week_start = monday
  where id = auth.uid();
end;
$$;

revoke all on function public.add_xp(integer) from public;
grant execute on function public.add_xp(integer) to authenticated;

alter table public.profiles enable row level security;
alter table public.friendships enable row level security;

-- profiles: lettura aperta a chi è loggato (classifica globale + ricerca amici).
create policy profiles_select on public.profiles
  for select to authenticated
  using (true);

-- Solo nome/avatar sono modificabili dal client; xp/weekly_xp/week_start/streak
-- restano fuori dai privilegi di colonna e si toccano solo via add_xp().
revoke update on public.profiles from authenticated;
grant update (display_name, avatar_emoji, avatar_url) on public.profiles to authenticated;

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- friendships: visibili solo alle due parti coinvolte.
create policy friendships_select on public.friendships
  for select to authenticated
  using (auth.uid() = user_id or auth.uid() = friend_id);

create policy friendships_insert on public.friendships
  for insert to authenticated
  with check (auth.uid() = user_id);

-- Solo chi riceve la richiesta può accettarla.
create policy friendships_update on public.friendships
  for update to authenticated
  using (auth.uid() = friend_id)
  with check (auth.uid() = friend_id);

create policy friendships_delete on public.friendships
  for delete to authenticated
  using (auth.uid() = user_id or auth.uid() = friend_id);
