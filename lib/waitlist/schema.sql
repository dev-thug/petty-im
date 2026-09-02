CREATE TABLE IF NOT EXISTS waitlist_entries (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
