import React, { useState } from 'react';
import { ArrowLeft, Users, Gift, Copy, Share2, Trophy, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBalance } from '../../contexts/BalanceContext';

interface ReferralViewProps {
  onBack: () => void;
}

export default function ReferralView({ onBack }: ReferralViewProps) {
  const { user } = useAuth();
  const { referralCount, earnings } = useBalance();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://hebutt88.com/register?ref=${user?.referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'H.E. Butt Grocery - Investissement',
          text: 'Rejoignez-moi sur cette plateforme d\'investissement et gagnez ensemble !',
          url: referralLink,
        });
      } catch (err) {
        console.error('Failed to share:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const levels = [
    { level: 1, commission: '12%', referrals: 'Direct', color: 'bg-green-500' },
    { level: 2, commission: '2%', referrals: 'Niveau 2', color: 'bg-green-500' },
    { level: 3, commission: '1%', referrals: 'Niveau 3', color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-3"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Programme de parrainage</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Parrainages totaux</p>
              <p className="text-3xl font-bold">{referralCount}</p>
            </div>
            <Users className="w-10 h-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Gains de parrainage</p>
              <p className="text-3xl font-bold">${(earnings * 0.3).toFixed(2)}</p>
            </div>
            <Gift className="w-10 h-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Rang équipe</p>
              <p className="text-3xl font-bold">#{Math.floor(Math.random() * 100) + 1}</p>
            </div>
            <Trophy className="w-10 h-10 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Votre code de parrainage</h2>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Code de parrainage</p>
              <p className="text-2xl font-bold text-red-600">{user?.referralCode}</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-600 mb-2">Lien de parrainage</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
            />
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-lg transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {copied ? 'Copié!' : 'Copier'}
            </button>
          </div>
        </div>

        <button
          onClick={shareLink}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center space-x-2"
        >
          <Share2 className="w-5 h-5" />
          <span>Partager le lien</span>
        </button>
      </div>

      {/* Commission Structure */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Structure des commissions</h2>
        
        <div className="space-y-3">
          {levels.map((level) => (
            <div key={level.level} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${level.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold">{level.level}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{level.referrals}</p>
                  <p className="text-sm text-gray-500">Niveau {level.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{level.commission}</p>
                <p className="text-xs text-gray-500">Commission</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Building Info */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <Star className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-bold">Créez une équipe</h2>
        </div>
        
        <p className="text-red-100 text-sm mb-4">
          Gagnez de gros prix et recevez un maximum de 8888 USDT ! Lorsque vous faites la promotion 
          de votre code d'invitation sur n'importe quel logiciel social, vous pouvez obtenir jusqu'à 
          15% de profit. L'équipe a un total de 50 clients et a la possibilité de recevoir des 
          récompenses 8888 USDT.
        </p>

        <div className="bg-white bg-opacity-10 rounded-xl p-4">
          <div className="flex items-center justify-between text-sm">
            <span>Progression vers 50 parrainages</span>
            <span className="font-bold">{referralCount}/50</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((referralCount / 50) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}