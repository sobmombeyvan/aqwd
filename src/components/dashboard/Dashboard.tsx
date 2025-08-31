import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import HomeView from '../views/HomeView';
import RechargeView from '../views/RechargeView';
import WithdrawView from '../views/WithdrawView';
import ReferralView from '../views/ReferralView';
import ProfileView from '../views/ProfileView';

type ViewType = 'home' | 'recharge' | 'withdraw' | 'referral' | 'profile';

interface DashboardProps {
  onShowAdmin?: () => void;
}

export default function Dashboard({ onShowAdmin }: DashboardProps) {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const { user } = useAuth();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={setCurrentView} onShowAdmin={onShowAdmin} />;
      case 'recharge':
        return <RechargeView onBack={() => setCurrentView('home')} />;
      case 'withdraw':
        return <WithdrawView onBack={() => setCurrentView('home')} />;
      case 'referral':
        return <ReferralView onBack={() => setCurrentView('home')} />;
      case 'profile':
        return <ProfileView onBack={() => setCurrentView('home')} />;
      default:
        return <HomeView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onShowAdmin={onShowAdmin} />
      <main className="pb-20">
        {renderView()}
      </main>
      <BottomNavigation currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
}