-- CodeLedger Demo Dashboard Schema

CREATE TABLE IF NOT EXISTS cic_history (
  id            TEXT PRIMARY KEY,
  checked_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  task          TEXT NOT NULL,
  completion_state TEXT NOT NULL,
  claim_count   INTEGER NOT NULL DEFAULT 0,
  verified_claim_count INTEGER NOT NULL DEFAULT 0,
  mismatch_count INTEGER NOT NULL DEFAULT 0,
  drift_warning_count INTEGER NOT NULL DEFAULT 0,
  persona       TEXT NOT NULL,
  pr_number     INTEGER
);

CREATE TABLE IF NOT EXISTS release_history (
  id              TEXT PRIMARY KEY,
  checked_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  release_state   TEXT NOT NULL,
  confidence_score REAL NOT NULL DEFAULT 0,
  finding_count   INTEGER NOT NULL DEFAULT 0,
  p0_count        INTEGER NOT NULL DEFAULT 0,
  p1_count        INTEGER NOT NULL DEFAULT 0,
  version_tag     TEXT
);

CREATE TABLE IF NOT EXISTS lessons (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  summary         TEXT NOT NULL,
  category        TEXT NOT NULL,
  severity        TEXT NOT NULL DEFAULT 'info',
  trigger_count   INTEGER NOT NULL DEFAULT 0,
  first_seen      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_triggered  TIMESTAMPTZ,
  active          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS ecl_events (
  id          TEXT PRIMARY KEY,
  event_type  TEXT NOT NULL,
  payload     JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_id  TEXT,
  persona     TEXT
);

CREATE TABLE IF NOT EXISTS health_snapshots (
  id          TEXT PRIMARY KEY,
  snapshot_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ahs_score   REAL NOT NULL DEFAULT 0,
  dri_score   REAL NOT NULL DEFAULT 0,
  eds_score   REAL NOT NULL DEFAULT 0,
  sts_score   REAL NOT NULL DEFAULT 0,
  ofs_score   REAL NOT NULL DEFAULT 0,
  dcs_score   REAL NOT NULL DEFAULT 0,
  grade       TEXT NOT NULL DEFAULT 'F'
);

CREATE TABLE IF NOT EXISTS invite_tokens (
  id          TEXT PRIMARY KEY,
  token_hash  TEXT NOT NULL UNIQUE,
  email       TEXT NOT NULL,
  scope       TEXT NOT NULL DEFAULT 'read',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked     BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS repo_snapshots (
  id            TEXT PRIMARY KEY,
  snapshot_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  repo_name     TEXT NOT NULL,
  file_count    INTEGER NOT NULL DEFAULT 0,
  total_lines   INTEGER NOT NULL DEFAULT 0,
  package_count INTEGER NOT NULL DEFAULT 0,
  metadata      JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS review_findings (
  id            TEXT PRIMARY KEY,
  found_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  rule          TEXT NOT NULL,
  severity      TEXT NOT NULL,
  file_path     TEXT NOT NULL,
  line_number   INTEGER,
  message       TEXT NOT NULL,
  disposition   TEXT NOT NULL DEFAULT 'new',
  pr_number     INTEGER,
  persona       TEXT
);

CREATE TABLE IF NOT EXISTS sandbox_runs (
  id          TEXT PRIMARY KEY,
  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  status      TEXT NOT NULL DEFAULT 'running',
  task        TEXT NOT NULL,
  persona     TEXT NOT NULL,
  result      JSONB,
  error       TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cic_checked_at ON cic_history (checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_cic_persona ON cic_history (persona);
CREATE INDEX IF NOT EXISTS idx_release_checked_at ON release_history (checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_lessons_category ON lessons (category);
CREATE INDEX IF NOT EXISTS idx_lessons_active ON lessons (active);
CREATE INDEX IF NOT EXISTS idx_ecl_created_at ON ecl_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ecl_event_type ON ecl_events (event_type);
CREATE INDEX IF NOT EXISTS idx_health_snapshot_at ON health_snapshots (snapshot_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_findings_rule ON review_findings (rule);
CREATE INDEX IF NOT EXISTS idx_review_findings_severity ON review_findings (severity);
CREATE INDEX IF NOT EXISTS idx_sandbox_status ON sandbox_runs (status);
