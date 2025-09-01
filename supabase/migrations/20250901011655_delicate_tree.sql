/*
  # Fix RLS policies for user registration

  1. Security Updates
    - Add INSERT policy for users table to allow authenticated users to create their own profile
    - Add INSERT policy for balances table to allow authenticated users to create their own balance record
  
  2. Changes
    - Users can now insert their own data during registration
    - Balance records can be created for new users
    - Maintains existing security by ensuring users can only insert data for themselves
*/

-- Add INSERT policy for users table
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Add INSERT policy for balances table  
CREATE POLICY "Users can insert own balance"
  ON balances
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);