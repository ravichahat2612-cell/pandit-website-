-- Supabase > SQL Editor में पूरा यह कोड पेस्ट करके RUN दबाएँ
create table settings(id int primary key, name text, tagline text, whatsapp text, phone text, upi_id text, qr_url text, intro text, experience text, speciality text, location text, festival_msg text, available_dates text, panchang text, pandit_photo text, logo_url text, hero_url text);
create table pujas(id bigint generated always as identity primary key, name text not null, description text, fee int default 0, photo_url text, upi_id text, qr_url text, sort int default 0);
create table bookings(id bigint generated always as identity primary key, name text, mobile text, puja_name text, puja_date text, place text, pincode text, note text, fee int, utr text, status text default 'pending', payment_status text default 'pending', created_at timestamptz default now());
create table gallery(id bigint generated always as identity primary key, url text not null);
create table reviews(id bigint generated always as identity primary key, name text, text text, rating int default 5, approved boolean default false);

alter table settings enable row level security; alter table pujas enable row level security; alter table bookings enable row level security; alter table gallery enable row level security; alter table reviews enable row level security;

-- सब देख सकते हैं
create policy "pub read settings" on settings for select using (true);
create policy "pub read pujas" on pujas for select using (true);
create policy "pub read gallery" on gallery for select using (true);
create policy "pub read approved reviews" on reviews for select using (approved = true);
-- ग्राहक सिर्फ बुकिंग/रिव्यू भेज सकते हैं (रिव्यू अपने आप approved नहीं होगा)
create policy "pub add booking" on bookings for insert to anon, authenticated with check (status = 'pending' and payment_status = 'pending');
create policy "pub add review" on reviews for insert to anon, authenticated with check (approved = false);
-- सिर्फ लॉगिन किया हुआ एडमिन सब बदल सकता है
create policy "admin all settings" on settings for all to authenticated using (true) with check (true);
create policy "admin all pujas" on pujas for all to authenticated using (true) with check (true);
create policy "admin all gallery" on gallery for all to authenticated using (true) with check (true);
create policy "admin all bookings" on bookings for all to authenticated using (true) with check (true);
create policy "admin all reviews" on reviews for all to authenticated using (true) with check (true);

-- फोटो स्टोरेज
insert into storage.buckets(id,name,public) values('media','media',true);
create policy "pub read media" on storage.objects for select using (bucket_id='media');
create policy "admin upload media" on storage.objects for insert to authenticated with check (bucket_id='media');
create policy "admin delete media" on storage.objects for delete to authenticated using (bucket_id='media');
insert into settings(id,name,tagline,whatsapp,phone,upi_id) values(1,'पंडित दीपक पाठक','सनातन धर्म एवं वैदिक पूजा सेवा','919999999999','+91 99999 99999','demo@upi');
