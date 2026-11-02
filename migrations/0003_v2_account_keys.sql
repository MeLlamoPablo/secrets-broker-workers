-- Per-account data keys. The original v2 vault had one DEK for the whole
-- deployment, so a session opened for one account could read every row. Each
-- account now gets its own keyring; rows remember which key sealed them.
--
-- Existing rows keep account_id NULL and stay on the legacy 'password' keyring,
-- which is why both columns are nullable and why nothing here rewrites a row.

ALTER TABLE keyrings ADD COLUMN account_id TEXT;

ALTER TABLE vault_items ADD COLUMN account_id TEXT;

ALTER TABLE devices ADD COLUMN account_id TEXT;

CREATE INDEX IF NOT EXISTS idx_keyrings_account ON keyrings (account_id);

CREATE INDEX IF NOT EXISTS idx_vault_items_account ON vault_items (account_id);
