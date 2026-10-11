-- Ejecutar en SQL Editor. Solo los usuarios en portfolio_admins podrán escribir.
create table if not exists public.portfolio_admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.portfolio_admins enable row level security;
create policy "Admins can verify membership" on public.portfolio_admins for select to authenticated using (user_id = (select auth.uid()));
grant select on public.portfolio_admins to authenticated;
revoke insert, update, delete on public.portfolio_admins from anon, authenticated;
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 120),
  website_url text not null check (website_url ~ '^https?://'),
  category text not null check (category in ('Web','App','IA','Landing','Web app','SaaS','ecommerce')),
  image_path text not null unique,
  image_width integer not null check (image_width > 0),
  image_height integer not null check (image_height > 0),
  created_at timestamptz not null default now()
);
create index projects_newest on public.projects (created_at desc, id desc);
alter table public.projects enable row level security;
grant select on public.projects to anon, authenticated;
grant insert, delete on public.projects to authenticated;
create policy "Public portfolio" on public.projects for select to anon, authenticated using (true);
create policy "Only portfolio admins publish" on public.projects for insert to authenticated with check (
  exists (select 1 from public.portfolio_admins where user_id = (select auth.uid()))
  and split_part(image_path,'/',1) = (select auth.uid())::text
);
create policy "Only portfolio admins delete" on public.projects for delete to authenticated using (exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())));
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('portfolio','portfolio',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict (id) do nothing;
create policy "Admin uploads portfolio images" on storage.objects for insert to authenticated with check (
  bucket_id = 'portfolio' and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.portfolio_admins where user_id = (select auth.uid()))
);
create policy "Admin reads portfolio files" on storage.objects for select to authenticated using (bucket_id = 'portfolio' and exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())));
create policy "Admin deletes portfolio images" on storage.objects for delete to authenticated using (bucket_id = 'portfolio' and exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())));


