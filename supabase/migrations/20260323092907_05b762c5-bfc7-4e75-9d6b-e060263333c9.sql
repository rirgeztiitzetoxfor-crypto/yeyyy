-- Site media CMS table
CREATE TABLE public.site_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id text UNIQUE NOT NULL,
  media_url text NOT NULL,
  media_type text NOT NULL DEFAULT 'image',
  alt_text text DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth needed to view site)
CREATE POLICY "Public read access" ON public.site_media
  FOR SELECT USING (true);

-- Storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public)
  VALUES ('site-media', 'site-media', true);

-- Public read access on storage objects
CREATE POLICY "Public read storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-media');

-- Service role can upload (edge functions bypass RLS anyway)
CREATE POLICY "Service role upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'site-media');

CREATE POLICY "Service role update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'site-media');

CREATE POLICY "Service role delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'site-media');