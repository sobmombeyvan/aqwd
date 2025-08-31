import React from 'react';
import { Home, CreditCard, Users, Star, User } from 'lucide-react';

type ViewType = 'home' | 'recharge' | 'withdraw' | 'referral' | 'profile';

interface BottomNavigationProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export default function BottomNavigation({ currentView, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: 'home' as ViewType, label: 'Maison', icon: Home },
    { id: 'recharge' as ViewType, label: 'Recharge', icon: CreditCard },
    { id: 'referral' as ViewType, label: 'Équipe', icon: Users },
    { id: 'withdraw' as ViewType, label: 'VIP', icon: Star },
    { id: 'profile' as ViewType, label: 'Moi', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                isActive
                  ? 'text-red-600 bg-red-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}