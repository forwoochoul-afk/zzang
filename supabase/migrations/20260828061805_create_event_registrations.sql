/*
# Create event_registrations table (single-tenant, no auth)

1. New Tables
- `event_registrations`
  - `id` (uuid, primary key)
  - `name` (text, not null) — 신청자 이름
  - `phone` (text, not null) — 신청자 전화번호
  - `created_at` (timestamp) — 신청 시각
2. Security
- Enable RLS on `event_registrations`.
- Allow anon + authenticated INSERT (누구나 신청 가능) and SELECT (신청 목록 조회).
- No auth screen in this app, so anon access is required.
*/

CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_registrations" ON event_registrations;
CREATE POLICY "anon_select_registrations" ON event_registrations
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_registrations" ON event_registrations;
CREATE POLICY "anon_insert_registrations" ON event_registrations
  FOR INSERT TO anon, authenticated WITH CHECK (true);
