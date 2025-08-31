import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Activity, Search, Filter, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
  balance: number;
  earnings: number;
  referral_count: number;
  transaction_count: number;
}

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'balance' | 'earnings' | 'created_at'>('balance');
  const [totalStats, setTotalStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    totalEarnings: 0,
    totalTransactions: 0,
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      // Load all users with their balance and transaction data
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          balances (
            balance,
            earnings,
            referral_count
          )
        `);

      if (usersError) throw usersError;

      // Load transaction counts for each user
      const { data: transactionCounts, error: transactionError } = await supabase
        .from('transactions')
        .select('user_id')
        .eq('status', 'completed');

      if (transactionError) throw transactionError;

      // Process the data
      const transactionCountMap = transactionCounts.reduce((acc, t) => {
        acc[t.user_id] = (acc[t.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const processedUsers: AdminUser[] = usersData.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        referral_code: user.referral_code,
        referred_by: user.referred_by,
        created_at: user.created_at,
        balance: user.balances?.[0]?.balance || 0,
        earnings: user.balances?.[0]?.earnings || 0,
        referral_count: user.balances?.[0]?.referral_count || 0,
        transaction_count: transactionCountMap[user.id] || 0,
      }));

      setUsers(processedUsers);

      // Calculate total stats
      const stats = processedUsers.reduce(
        (acc, user) => ({
          totalUsers: acc.totalUsers + 1,
          totalBalance: acc.totalBalance + user.balance,
          totalEarnings: acc.totalEarnings + user.earnings,
          totalTransactions: acc.totalTransactions + user.transaction_count,
        }),
        { totalUsers: 0, totalBalance: 0, totalEarnings: 0, totalTransactions: 0 }
      );

      setTotalStats(stats);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.referral_code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'balance':
          return b.balance - a.balance;
        case 'earnings':
          return b.earnings - a.earnings;
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 rounded-full hover:bg-red-500 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">CashFlowa Admin</h1>
                <p className="text-red-100 text-sm">Tableau de bord administrateur</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Utilisateurs totaux</p>
                <p className="text-3xl font-bold text-gray-800">{totalStats.totalUsers}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Solde total</p>
                <p className="text-3xl font-bold text-green-600">${totalStats.totalBalance.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Gains totaux</p>
                <p className="text-3xl font-bold text-green-600">${totalStats.totalEarnings.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Transactions</p>
                <p className="text-3xl font-bold text-green-600">{totalStats.totalTransactions}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Rechercher par nom, email ou code..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="balance">Trier par solde</option>
                  <option value="earnings">Trier par gains</option>
                  <option value="created_at">Trier par date</option>
                </select>
              </div>
              <button
                onClick={loadAdminData}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">
              Utilisateurs ({filteredUsers.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Solde
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Gains
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Parrainages
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Transactions
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Inscription
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">Code: {user.referral_code}</div>
                        {user.referred_by && (
                          <div className="text-xs text-green-600">Parrainé par: {user.referred_by}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">
                        ${user.balance.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">
                        ${user.earnings.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.referral_count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.transaction_count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}