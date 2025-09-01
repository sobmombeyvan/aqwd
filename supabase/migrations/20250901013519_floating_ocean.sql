/*
  # Fix policy conflicts

  1. Policy Management
    - Drop existing policies if they exist to avoid conflicts
    - Recreate policies with proper conditions
    - Ensure all tables have proper RLS policies

  2. Security
    - Maintain RLS on all tables
    - Ensure proper access control for users and admin
    - Add missing policies where needed

  3. Changes
    - Fix duplicate policy creation errors
    - Standardize policy naming and conditions
*/

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can insert own balance" ON balances;
DROP POLICY IF EXISTS "Users can read own balance" ON balances;
DROP POLICY IF EXISTS "Users can update own balance" ON balances;
DROP POLICY IF EXISTS "Admin can read all balances" ON balances;

DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;
DROP POLICY IF EXISTS "Admin can read all transactions" ON transactions;

DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admin can read all users" ON users;

-- Recreate policies for balances table
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
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.email = 'admin@cashflowa.com'
    )
  );

-- Recreate policies for transactions table
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
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.email = 'admin@cashflowa.com'
    )
  );

-- Recreate policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admin can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (email = 'admin@cashflowa.com');

-- Ensure RLS is enabled on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;