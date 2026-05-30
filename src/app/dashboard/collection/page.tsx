'use client';
import { useEffect, useState } from 'react';

export default function CollectionDashboard() {
  const [loans, setLoans] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState({ loanId: '', utrNumber: '', amount: '' });
  const [error, setError] = useState('');

  const fetchLoans = async () => {
    const res = await fetch('/api/dashboard/collection');
    const data = await res.json();
    if (data.success) setLoans(data.loans);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/dashboard/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...paymentData,
        amount: Number(paymentData.amount)
      })
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setPaymentData({ loanId: '', utrNumber: '', amount: '' }); // Reset form
      fetchLoans(); // Refresh active loans
      alert(data.loan.status === 'CLOSED' ? 'Loan fully repaid and CLOSED!' : 'Payment recorded.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100 flex flex-col md:flex-row gap-8">
      
      {/* Active Loans Table */}
      <div className="w-full md:w-2/3 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden h-fit">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-emerald-400">Active Loans (Disbursed)</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="px-6 py-4">Borrower</th>
              <th className="px-6 py-4">Total Repayment</th>
              <th className="px-6 py-4">Paid</th>
              <th className="px-6 py-4">Outstanding</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id} className="border-t border-gray-700">
                <td className="px-6 py-4 font-medium">{loan.borrowerId?.fullName}</td>
                <td className="px-6 py-4">₹{loan.totalRepayment}</td>
                <td className="px-6 py-4 text-emerald-400">₹{loan.amountPaid}</td>
                <td className="px-6 py-4 text-red-400 font-bold">₹{(loan.totalRepayment - loan.amountPaid).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => setPaymentData({ ...paymentData, loanId: loan._id })}
                    className="text-emerald-400 hover:underline"
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Payment Form */}
      <div className="w-full md:w-1/3 bg-gray-800 rounded-lg border border-gray-700 p-6 h-fit">
        <h2 className="text-xl font-bold text-white mb-6">Record Payment</h2>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400">Selected Loan ID</label>
            <input 
              type="text" readOnly required value={paymentData.loanId}
              className="w-full px-4 py-2 mt-1 bg-gray-900 border border-gray-600 text-gray-500 rounded-lg cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">UTR Number (Unique)</label>
            <input 
              type="text" required placeholder="e.g. HDFC123456789"
              value={paymentData.utrNumber} onChange={(e) => setPaymentData({...paymentData, utrNumber: e.target.value})}
              className="w-full px-4 py-2 mt-1 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Amount (₹)</label>
            <input 
              type="number" required step="0.01"
              value={paymentData.amount} onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
              className="w-full px-4 py-2 mt-1 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button 
            type="submit" disabled={!paymentData.loanId}
            className="w-full px-4 py-2 mt-4 font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
}