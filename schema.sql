-- Table for artisan products
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  materials text,
  image_url text, -- For temporary preview or storage URL
  artisan_name text, -- Optional for this MVP
  status text default 'published' -- draft, published
);

-- Enable RLS
alter table products enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access" on products
  for select using (true);

-- Create policy to allow public insert (for this MVP demo)
create policy "Allow public insert" on products
  for insert with check (true);
