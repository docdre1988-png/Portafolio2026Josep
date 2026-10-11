begin;
alter table public.projects drop constraint if exists projects_category_check;
update public.projects set category = 'ecommerce' where category = 'E-commerce / Tiendas digitales';
alter table public.projects add constraint projects_category_check
check (category in ('Web', 'App', 'IA', 'Landing', 'Web app', 'SaaS', 'ecommerce'));
commit;
