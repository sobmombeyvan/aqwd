import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Calendar, Gift, Settings, Shield, HelpCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBalance } from '../../contexts/BalanceContext';

interface ProfileViewProps {
  onBack: () => void;
}

export default function ProfileView({ onBack }: ProfileViewProps) {
  const { user, logout } = useAuth();
  const { balance, transactions, earnings } = useBalance();
  const [showSettings, setShowSettings] = useState(false);

  const profileStats = [
    { label: 'Solde total', value: `$${balance.toFixed(2)}`, color: 'text-green-600' },
    { label: 'Gains totaux', value: `$${earnings.toFixed(2)}`, color: 'text-green-600' },
    { label: 'Transactions', value: transactions.length.toString(), color: 'text-purple-600' },
    { label: 'Jours actifs', value: '15', color: 'text-orange-600' },
  ];

  const menuItems = [
    { id: 'security', label: 'Sécurité du compte', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Settings },
    { id: 'help', label: 'Centre d\'aide', icon: HelpCircle },
    { id: 'referral', label: 'Mon code de parrainage', icon: Gift },
  ];

  const handleMenuClick = (id: string) => {
    switch (id) {
      case 'security':
        alert('Fonctionnalité de sécurité bientôt disponible');
        break;
      case 'notifications':
        alert('Paramètres de notifications bientôt disponibles');
        break;
      case 'help':
        alert('Centre d\'aide bientôt disponible');
        break;
      case 'referral':
        setShowSettings(true);
        break;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-3"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Profil</h1>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-red-100">{user?.email}</p>
            <p className="text-red-200 text-sm">
              Membre depuis {new Date(user?.createdAt || '').toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {profileStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-4 shadow-lg">
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* User Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Informations du compte</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-800">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <Gift className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Code de parrainage</p>
              <p className="font-medium text-gray-800">{user?.referralCode}</p>
            </div>
          </div>

          {user?.referredBy && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Parrainé par</p>
                <p className="font-medium text-gray-800">{user.referredBy}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Date d'inscription</p>
              <p className="font-medium text-gray-800">
                {new Date(user?.createdAt || '').toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-2xl shadow-lg mb-6">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Paramètres</h3>
        </div>
        <div className="p-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-700">{item.label}</span>
                </div>
                <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
        >
          Se déconnecter
        </button>
      </div>

      {/* Referral Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Paramètres de parrainage</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <p className="font-medium text-green-800 mb-2">Code de parrainage</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">{user?.referralCode}</span>
                  <button
                    onClick={copyToClipboard}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Copier
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={shareLink}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Partager</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}