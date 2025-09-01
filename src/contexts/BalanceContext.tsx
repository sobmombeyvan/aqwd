import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'referral' | 'investment';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  description: string;
}

interface BalanceContextType {
  balance: number;
  transactions: Transaction[];
  earnings: number;
  referralCount: number;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => Promise<void>;
  updateBalance: (amount: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}

interface BalanceProviderProps {
  children: ReactNode;
}

export function BalanceProvider({ children }: BalanceProviderProps) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [referralCount, setReferralCount] = useState(0);

  const refreshData = async () => {
    if (!user || !isSupabaseConfigured()) return;

    try {
      // Load balance data
      const { data: balanceData } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (balanceData) {
        setBalance(balanceData.balance);
        setEarnings(balanceData.earnings);
        setReferralCount(balanceData.referral_count);
      }

      // Load transactions
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (transactionsData) {
        const formattedTransactions: Transaction[] = transactionsData.map(t => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          status: t.status,
          date: t.created_at,
          description: t.description,
        }));
        setTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: transaction.type,
          amount: transaction.amount,
          status: transaction.status,
          description: transaction.description,
        });

      if (error) throw error;

      await refreshData();
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateBalance = async (newBalance: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('balances')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (error) throw error;

      setBalance(newBalance);
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  };

  return (
    <BalanceContext.Provider value={{
      balance,
      transactions,
      earnings,
      referralCount,
      addTransaction,
      updateBalance,
      refreshData,
    }}>
      {children}
    </BalanceContext.Provider>
  );
}