/*
  # Create balances table

  1. New Tables
    - `balances`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `balance` (numeric, default 0)
      - `earnings` (numeric, default 0)
      - `referral_count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `balances` table
    - Add policies for users to read/update their own balance
    - Add policy for admin to read all balances
*/

CREATE TABLE IF NOT EXISTS balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  balance numeric DEFAULT 0,
  earnings numeric DEFAULT 0,
  referral_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own balance"
  ON balances
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin can read all balances"
  ON balances
  FOR SELECT
  TO authenticated
  USING (auth.email() = 'admin@cashflowa.com');

CREATE POLICY "Users can update own balance"
  ON balances
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own balance"
  ON balances
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE TRIGGER update_balances_updated_at
  BEFORE UPDATE ON balances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create unique index on user_id
CREATE UNIQUE INDEX IF NOT EXISTS balances_user_id_idx ON balances(user_id);