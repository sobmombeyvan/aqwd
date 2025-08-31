import React from 'react';
import { Bell, Globe, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onShowAdmin?: () => void;
}

export default function Header({ onShowAdmin }: HeaderProps) {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="bg-gradient-to-r from-red-600 to-red-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-red-600 font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">CashFlowa</h1>
              <p className="text-red-100 text-sm">Plateforme d'investissement intelligente</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAdmin && onShowAdmin && (
              <button 
                onClick={onShowAdmin}
                className="p-2 rounded-full hover:bg-red-500 transition-colors"
                title="Panneau d'administration"
              >
                <Shield className="w-5 h-5" />
              </button>
            )}
            <button className="p-2 rounded-full hover:bg-red-500 transition-colors">
              <Globe className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-red-500 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-800 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                3
              </span>
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-full hover:bg-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-red-800 px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-100 text-sm flex items-center">
            <span className="bg-red-600 rounded-full w-2 h-2 mr-2 animate-pulse"></span>
            Recevez un bénéfice quotidien maximum de 26,666.00 USDT. Chers utilisateurs CashFlowa, merci pour votre support !
          </p>
        </div>
      </div>
    </header>
  );
}