ALTER TABLE listings
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS listings_user_id_idx ON listings(user_id);
