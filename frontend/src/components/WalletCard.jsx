import React, { useState } from 'react';

const WalletCard = ({ initialBalance = 2500, rechargeAmount = 500 }) => {
  const [balance, setBalance] = useState(initialBalance);

  const handleRecharge = () => {
    setBalance((current) => current + rechargeAmount);
  };

  return (
    <div className="w-full max-w-xs bg-gray-700 border border-gray-600 rounded-3xl p-4 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleRecharge}
          className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
        >
          Recharge
        </button>

        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-300">Wallet</p>
          <p className="mt-1 text-lg font-bold text-emerald-300">LKR {balance}</p>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
