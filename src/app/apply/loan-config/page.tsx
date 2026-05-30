'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { calculateRepayment } from '../../../helpers/calculateInterest';

export default function LoanConfigPage() {
  const [amount, setAmount] = useState(50000);
  const [tenure, setTenure] = useState(30);
  const [totals, setTotals] = useState({
    simpleInterest: 0,
    totalRepayment: 0,
  });

  useEffect(() => {
    const results = calculateRepayment(amount, tenure);
    setTotals(results);
  }, [amount, tenure]);

  const handleApply = async () => {
    try {
      const response = await fetch('/api/borrower/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          principalAmount: amount,
          tenureDays: tenure,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Application submitted successfully!');
      } else {
        alert(data.error || 'Failed to submit.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
        
        {/* Back Button */}
        <Link
          href="/"
          className="inline-block mb-4 text-emerald-400 hover:text-emerald-300 font-medium"
        >
          ← Back to Dashboard
        </Link>

        <h2 className="text-2xl font-bold text-white mb-6">
          Configure Your Loan
        </h2>

        {/* Loan Amount Slider */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Loan Amount:{' '}
            <span className="text-emerald-400 font-bold">
              ₹{amount.toLocaleString()}
            </span>
          </label>

          <input
            type="range"
            min="50000"
            max="500000"
            step="5000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>₹50K</span>
            <span>₹5L</span>
          </div>
        </div>

        {/* Tenure Slider */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tenure:{' '}
            <span className="text-emerald-400 font-bold">
              {tenure} Days
            </span>
          </label>

          <input
            type="range"
            min="30"
            max="365"
            step="1"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>30 Days</span>
            <span>365 Days</span>
          </div>
        </div>

        {/* Live Calculation Panel */}
        <div className="bg-gray-700 p-4 rounded-lg mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-gray-300">
              Interest Rate (Fixed):
            </span>
            <span className="font-semibold text-white">
              12% p.a.
            </span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-gray-300">
              Total Interest (SI):
            </span>
            <span className="font-semibold text-red-400">
              + ₹{totals.simpleInterest}
            </span>
          </div>

          <hr className="border-gray-600 my-2" />

          <div className="flex justify-between text-lg">
            <span className="font-bold text-gray-200">
              Total Repayment:
            </span>
            <span className="font-bold text-emerald-400">
              ₹{totals.totalRepayment}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
          >
            Dashboard
          </Link>

          <button
            onClick={handleApply}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}