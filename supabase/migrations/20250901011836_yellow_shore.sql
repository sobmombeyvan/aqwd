/*
  # Fix RLS policies for user registration

  1. Security Updates
    - Add INSERT policy for users table to allow user registration
    - Add INSERT policy for balances table to allow initial balance creation
    - Ensure users can only insert their own data

  2. Changes
    - Users can now create their own profile during registration
    - Users can create their initial balance record
    - Maintains security by restricting to own user ID only
*/

-- Add INSERT policy for users table
CREATE POLICY "Users can insert own profile"
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