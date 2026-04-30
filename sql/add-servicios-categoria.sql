alter table public.servicios
add column if not exists categoria text not null default 'General';

update public.servicios
set categoria = 'General'
where categoria is null or trim(categoria) = '';
