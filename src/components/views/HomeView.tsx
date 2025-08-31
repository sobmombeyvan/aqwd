import React from 'react';
import { TrendingUp, DollarSign, Users, Award, ArrowUpRight, ArrowDownLeft, Download, Building } from 'lucide-react';
import { useBalance } from '../../contexts/BalanceContext';
import { useAuth } from '../../contexts/AuthContext';

interface HomeViewProps {
  onNavigate: (view: 'recharge' | 'withdraw' | 'referral' | 'profile') => void;
  onShowAdmin?: () => void;
}

export default function HomeView({ onNavigate, onShowAdmin }: HomeViewProps) {
  const { balance, earnings, referralCount, transactions } = useBalance();
  const { user, isAdmin } = useAuth();

  const recentTransactions = transactions.slice(0, 3);

  const actionButtons = [
    {
      id: 'recharge',
      label: 'Recharger',
      icon: ArrowUpRight,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => onNavigate('recharge'),
    },
    {
      id: 'withdraw',
      label: 'Retirer',
      icon: ArrowDownLeft,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => onNavigate('withdraw'),
    },
    {
      id: 'app',
      label: 'Application',
      icon: Download,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => alert('Téléchargement de l\'application bientôt disponible'),
    },
    {
      id: 'company',
      label: 'Profil de l\'entreprise',
      icon: Building,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => onNavigate('profile'),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-red-100 text-sm">Solde total</p>
            <p className="text-3xl font-bold">${balance.toFixed(2)} USDT</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-full p-3">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white bg-opacity-10 rounded-xl p-3">
            <p className="text-red-100 text-sm">Gains totaux</p>
            <p className="text-xl font-semibold">${earnings.toFixed(2)}</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-xl p-3">
            <p className="text-red-100 text-sm">Parrainages</p>
            <p className="text-xl font-semibold">{referralCount}</p>
          </div>
        </div>
        
        {isAdmin && onShowAdmin && (
          <button
            onClick={onShowAdmin}
            className="mt-4 w-full bg-white bg-opacity-20 text-white py-2 rounded-lg font-medium hover:bg-opacity-30 transition-all flex items-center justify-center space-x-2"
          >
            <Shield className="w-5 h-5" />
            <span>Panneau Admin</span>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {actionButtons.map((button) => {
          const Icon = button.icon;
          return (
            <button
              key={button.id}
              onClick={button.action}
              className={`${button.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">{button.label}</span>
                <Icon className="w-8 h-8" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rendement journalier</p>
              <p className="text-2xl font-bold text-green-600">2.5%</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Bonus de parrainage</p>
              <p className="text-2xl font-bold text-green-600">15%</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Niveau VIP</p>
              <p className="text-2xl font-bold text-purple-600">Bronze</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Transactions récentes</h2>
        </div>
        <div className="p-6">
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'deposit' ? 'bg-green-100' :
                      transaction.type === 'withdrawal' ? 'bg-red-100' :
                      transaction.type === 'referral' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {transaction.type === 'deposit' && <ArrowUpRight className="w-5 h-5 text-green-600" />}
                      {transaction.type === 'withdrawal' && <ArrowDownLeft className="w-5 h-5 text-red-600" />}
                      {transaction.type === 'referral' && <Users className="w-5 h-5 text-blue-600" />}
                      {transaction.type === 'investment' && <TrendingUp className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                    </p>
                    <p className={`text-xs ${
                      transaction.status === 'completed' ? 'text-green-600' :
                      transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {transaction.status === 'completed' ? 'Complété' :
                       transaction.status === 'pending' ? 'En attente' : 'Échec'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Aucune transaction pour le moment</p>
              <p className="text-sm text-gray-400 mt-1">Commencez par recharger votre compte</p>
            </div>
          )}
        </div>
      </div>

      {/* Investment Opportunities */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Opportunités d'investissement</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-green-800">Plan Bronze</h3>
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Recommandé
              </span>
            </div>
            <p className="text-green-700 text-sm mb-3">
              Investissement minimum: $100 • Rendement: 2.5% par jour
            </p>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Investir maintenant
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-green-800">Plan Argent</h3>
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Populaire
              </span>
            </div>
            <p className="text-green-700 text-sm mb-3">
              Investissement minimum: $500 • Rendement: 3.2% par jour
            </p>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Investir maintenant
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-purple-800">Plan Or</h3>
              <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                Premium
              </span>
            </div>
            <p className="text-purple-700 text-sm mb-3">
              Investissement minimum: $1000 • Rendement: 4.0% par jour
            </p>
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Investir maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}