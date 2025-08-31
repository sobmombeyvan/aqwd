import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Banknote, Check } from 'lucide-react';
import { useBalance } from '../../contexts/BalanceContext';

interface RechargeViewProps {
  onBack: () => void;
}

export default function RechargeView({ onBack }: RechargeViewProps) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addTransaction, updateBalance, balance } = useBalance();

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  const paymentMethods = [
    { id: 'card', label: 'Carte bancaire', icon: CreditCard },
    { id: 'mobile', label: 'Paiement mobile', icon: Smartphone },
    { id: 'crypto', label: 'Cryptomonnaie', icon: Banknote },
  ];

  const handleRecharge = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const rechargeAmount = parseFloat(amount);
      addTransaction({
        type: 'deposit',
        amount: rechargeAmount,
        status: 'completed',
        description: `Rechargement par ${paymentMethods.find(m => m.id === paymentMethod)?.label}`,
      });

      updateBalance(balance + rechargeAmount);
      setSuccess(true);
      setAmount('');

      setTimeout(() => {
        setSuccess(false);
        onBack();
      }, 2000);
    } catch (error) {
      console.error('Recharge failed:', error);
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Rechargement réussi !</h2>
          <p className="text-gray-600">Votre compte a été crédité avec succès.</p>
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
        <h1 className="text-2xl font-bold text-gray-800">Recharger le compte</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant (USDT)
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
              min="10"
              step="0.01"
            />
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Montants rapides</p>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="py-2 px-4 border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-600 transition-colors text-sm font-medium"
              >
                ${quickAmount}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Méthode de paiement</p>
          <div className="space-y-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <Icon className={`w-5 h-5 mr-3 ${
                    paymentMethod === method.id ? 'text-red-600' : 'text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    paymentMethod === method.id ? 'text-red-600' : 'text-gray-700'
                  }`}>
                    {method.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Recharge Button */}
        <button
          onClick={handleRecharge}
          disabled={!amount || parseFloat(amount) < 10 || loading}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-medium hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Traitement...
            </div>
          ) : (
            `Recharger ${amount ? `$${amount}` : ''} USDT`
          )}
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Montant minimum: $10 USDT • Frais: 0%
          </p>
        </div>
      </div>
    </div>
  );
}