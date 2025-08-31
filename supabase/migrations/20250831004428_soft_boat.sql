/*
  # Add referral helper functions

  1. Functions
    - `increment_referral_count` - Increments referral count for a user
    - `get_user_stats` - Gets comprehensive user statistics

  2. Security
    - Functions are accessible to authenticated users
*/

-- Function to increment referral count
CREATE OR REPLACE FUNCTION increment_referral_count(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE balances 
  SET referral_count = referral_count + 1,
      updated_at = now()
  WHERE balances.user_id = increment_referral_count.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_id uuid)
RETURNS TABLE (
  total_deposits numeric,
  total_withdrawals numeric,
  pending_withdrawals numeric,
  completed_transactions bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN type = 'deposit' AND status = 'completed' THEN amount ELSE 0 END), 0) as total_deposits,
    COALESCE(SUM(CASE WHEN type = 'withdrawal' AND status = 'completed' THEN amount ELSE 0 END), 0) as total_withdrawals,
    COALESCE(SUM(CASE WHEN type = 'withdrawal' AND status = 'pending' THEN amount ELSE 0 END), 0) as pending_withdrawals,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_transactions
  FROM transactions 
  WHERE transactions.user_id = get_user_stats.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;