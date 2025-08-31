import React, { useState } from 'react';
import { ArrowLeft, Wallet, AlertCircle, Check } from 'lucide-react';
import { useBalance } from '../../contexts/BalanceContext';

interface WithdrawViewProps {
  onBack: () => void;
}

export default function WithdrawView({ onBack }: WithdrawViewProps) {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { balance, addTransaction, updateBalance } = useBalance();

  const quickPercentages = [25, 50, 75, 100];

  const handleWithdraw = async () => {
    if (!amount || !address || parseFloat(amount) <= 0 || parseFloat(amount) > balance) return;

    setLoading(true);
    try {
      // Simulate withdrawal processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const withdrawAmount = parseFloat(amount);
      addTransaction({
        type: 'withdrawal',
        amount: withdrawAmount,
        status: 'pending',
        description: `Retrait vers ${address.substring(0, 10)}...`,
      });

      updateBalance(balance - withdrawAmount);
      setSuccess(true);
      setAmount('');
      setAddress('');

      setTimeout(() => {
        setSuccess(false);
        onBack();
      }, 2000);
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Retrait demandé !</h2>
          <p className="text-gray-600">Votre retrait sera traité sous 24-48h.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-3"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Retirer des fonds</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Balance Info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Solde disponible</span>
            <span className="text-2xl font-bold text-gray-800">${balance.toFixed(2)} USDT</span>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant à retirer (USDT)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-lg"
              placeholder="0.00"
              min="20"
              max={balance}
              step="0.01"
            />
          </div>
        </div>

        {/* Quick Percentage Buttons */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Retrait rapide</p>
          <div className="grid grid-cols-4 gap-2">
            {quickPercentages.map((percentage) => (
              <button
                key={percentage}
                onClick={() => setAmount((balance * percentage / 100).toFixed(2))}
                className="py-2 px-3 border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-600 transition-colors text-sm font-medium"
              >
                {percentage}%
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse du portefeuille USDT
          </label>
          <div className="relative">
            <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder="Entrez votre adresse USDT"
              required
            />
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Important:</p>
              <ul className="space-y-1 text-xs">
                <li>• Montant minimum: $20 USDT</li>
                <li>• Frais de réseau: $2 USDT</li>
                <li>• Délai de traitement: 24-48h</li>
                <li>• Vérifiez votre adresse avant de confirmer</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Withdraw Button */}
        <button
          onClick={handleWithdraw}
          disabled={
            !amount || 
            !address || 
            parseFloat(amount) < 20 || 
            parseFloat(amount) > balance || 
            loading
          }
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Traitement...
            </div>
          ) : (
            `Retirer ${amount ? `$${amount}` : ''} USDT`
          )}
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Les retraits sont traités manuellement pour votre sécurité
          </p>
        </div>
      </div>
    </div>
  );
}