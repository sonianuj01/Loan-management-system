'use client';
import { useEffect, useState } from 'react';

export default function SanctionDashboard() {
  const [loans, setLoans] = useState<any[]>([]);

  const fetchLoans = async () => {
    const res = await fetch('/api/dashboard/sanction');
    const data = await res.json();
    if (data.success) setLoans(data.loans);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleAction = async (loanId: string, status: string) => {
    let rejectionReason = '';
    if (status === 'REJECTED') {
      rejectionReason = prompt('Enter rejection reason:') || 'Criteria not met';
    }

    await fetch('/api/dashboard/sanction', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loanId, status, rejectionReason })
    });
    fetchLoans(); // Refresh list
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-orange-400">Sanction Dashboard</h1>
      <p className="text-gray-400 mb-8">Review and approve newly applied loans.</p>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="px-6 py-4">Borrower</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Tenure</th>
              <th className="px-6 py-4">Total Repayment</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No pending loans to sanction.</td></tr>
            ) : (
              loans.map((loan) => (
                <tr key={loan._id} className="border-t border-gray-700">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{loan.borrowerId?.fullName}</div>
                    <div className="text-xs text-gray-400">{loan.borrowerId?.pan}</div>
                  </td>
                  <td className="px-6 py-4 text-emerald-400">₹{loan.principalAmount}</td>
                  <td className="px-6 py-4">{loan.tenureDays} Days</td>
                  <td className="px-6 py-4">₹{loan.totalRepayment}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <button 
                      onClick={() => handleAction(loan._id, 'SANCTIONED')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleAction(loan._id, 'REJECTED')}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Reject
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