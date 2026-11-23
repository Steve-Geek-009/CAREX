-- Non-destructive migration for CAREX Draft 1 Real Google Authentication
-- Adds profile image URL and last login tracking and aligns role/account_status defaults.
-- Safe to run on existing databases without erasing user records.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP NOT NULL DEFAULT NOW();

ALTER TABLE users
  ALTER COLUMN role SET DEFAULT 'CLIENT';

ALTER TABLE users
  ALTER COLUMN account_status SET DEFAULT 'ACTIVE';

-- Normalize any pre-existing role/status values non-destructively
UPDATE users
SET role = CASE
  WHEN UPPER(role) = 'ADMIN' THEN 'ADMIN'
  ELSE 'CLIENT'
END
WHERE role NOT IN ('CLIENT', 'ADMIN');

UPDATE users
SET account_status = CASE
  WHEN UPPER(REPLACE(account_status, ' ', '_')) = 'RESTRICTED' THEN 'RESTRICTED'
  WHEN UPPER(REPLACE(account_status, ' ', '_')) = 'UNDER_REVIEW' THEN 'UNDER_REVIEW'
  ELSE 'ACTIVE'
END
WHERE account_status NOT IN ('ACTIVE', 'UNDER_REVIEW', 'RESTRICTED');
