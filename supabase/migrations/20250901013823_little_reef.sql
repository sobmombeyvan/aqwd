/*
  # Fix authentication and user policies

  1. Security Updates
    - Update RLS policies for proper user authentication
    - Ensure users can insert their own records during registration
    - Fix policy conflicts and ensure proper access control

  2. Policy Updates
    - Allow users to insert their own user record during registration
    - Maintain secure access to user data
    - Ensure admin access works properly
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admin can read all users" ON users;
DROP POLICY IF EXISTS "Users can insert own balance" ON balances;
DROP POLICY IF EXISTS "Users can read own balance" ON balances;
DROP POLICY IF EXISTS "Users can update own balance" ON balances;
DROP POLICY IF EXISTS "Admin can read all balances" ON balances;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;
DROP POLICY IF EXISTS "Admin can read all transactions" ON transactions;

-- Create helper function to get current user email
CREATE OR REPLACE FUNCTION auth.email() RETURNS text AS $$
  SELECT COALESCE(
    auth.jwt() ->> 'email',
    (auth.jwt() -> 'user_metadata' ->> 'email')
  )::text;
$$ LANGUAGE sql SECURITY DEFINER;

-- Create helper function to get current user ID
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid AS $$
  SELECT COALESCE(
    auth.jwt() ->> 'sub',
    (auth.jwt() ->> 'user_id')
  )::uuid;
$$ LANGUAGE sql SECURITY DEFINER;

-- Users table policies
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.email() = 'admin@cashflowa.com');

-- Balances table policies
CREATE POLICY "Users can insert own balance"
  ON balances
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own balance"
  ON balances
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own balance"
  ON balances
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can read all balances"
  ON balances
  FOR SELECT
  TO authenticated
  USING (auth.email() = 'admin@cashflowa.com');

-- Transactions table policies
CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

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