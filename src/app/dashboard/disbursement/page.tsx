'use client';
import { useEffect, useState } from 'react';

export default function DisbursementDashboard() {
  const [loans, setLoans] = useState<any[]>([]);

  const fetchLoans = async () => {
    const res = await fetch('/api/dashboard/disbursement');
    const data = await res.json();
    if (data.success) setLoans(data.loans);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleDisburse = async (loanId: string) => {
    if (!confirm('Confirm funds have been released to the borrower?')) return;
    
    await fetch('/api/dashboard/disbursement', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loanId })
    });
    fetchLoans(); // Refresh list
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Disbursement Dashboard</h1>
      <p className="text-gray-400 mb-8">Release funds for sanctioned loans.</p>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="px-6 py-4">Borrower</th>
              <th className="px-6 py-4">Sanctioned Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No pending disbursements.</td></tr>
            ) : (
              loans.map((loan) => (
                <tr key={loan._id} className="border-t border-gray-700">
                  <td className="px-6 py-4 font-medium">{loan.borrowerId?.fullName}</td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">₹{loan.principalAmount}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-orange-900/50 text-orange-400 rounded text-xs">SANCTIONED</span></td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDisburse(loan._id)}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded"
                    >
                      Mark Disbursed
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}