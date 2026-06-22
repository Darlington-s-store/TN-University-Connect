
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_role TEXT NOT NULL CHECK (recipient_role IN ('admin','member','public')),
  recipient_id TEXT,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_role_created ON public.notifications(recipient_role, created_at DESC);
CREATE INDEX idx_notifications_recipient_id ON public.notifications(recipient_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO anon, authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read notifications"
  ON public.notifications FOR SELECT
  USING (true);

CREATE POLICY "Public can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update notifications"
  ON public.notifications FOR UPDATE
  USING (true);
