/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `type` (enum: deposit, withdrawal, referral, investment)
      - `amount` (numeric)
      - `status` (enum: pending, completed, failed)
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `transactions` table
    - Add policies for users to read their own transactions
    - Add policy for admin to read all transactions
    - Add policy for users to insert their own transactions
*/

CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'referral', 'investment');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount numeric NOT NULL,
  status transaction_status DEFAULT 'pending',
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin can read all transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.email() = 'admin@cashflowa.com');

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON transactions(user_id);
CREATE INDEX IF NOT EXISTS transactions_created_at_idx ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS transactions_type_idx ON transactions(type);