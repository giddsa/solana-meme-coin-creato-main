CREATE TABLE tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  decimals INTEGER NOT NULL DEFAULT 9,
  supply BIGINT NOT NULL,
  description TEXT,
  logo_url TEXT,
  mint_address TEXT,
  freeze_authority_revoked BOOLEAN DEFAULT FALSE,
  mint_authority_revoked BOOLEAN DEFAULT FALSE,
  update_authority_revoked BOOLEAN DEFAULT FALSE,
  creator_name TEXT,
  creator_website TEXT,
  twitter_url TEXT,
  telegram_url TEXT,
  discord_url TEXT,
  custom_page_url TEXT,
  network TEXT NOT NULL DEFAULT 'devnet',
  transaction_signature TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE liquidity_controls (
  id TEXT PRIMARY KEY,
  token_id TEXT NOT NULL REFERENCES tokens(id) ON DELETE CASCADE,
  multi_sig_enabled BOOLEAN DEFAULT FALSE,
  required_signatures INTEGER DEFAULT 1,
  timelock_duration INTEGER DEFAULT 0,
  withdrawal_addresses TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(token_id)
);

CREATE INDEX idx_tokens_user_id ON tokens(user_id);
CREATE INDEX idx_tokens_network ON tokens(network);
CREATE INDEX idx_liquidity_controls_token_id ON liquidity_controls(token_id);
