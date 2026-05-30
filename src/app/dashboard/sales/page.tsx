'use client';
import { useEffect, useState } from 'react';

export default function SalesDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // 1. Added missing loading state

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch('/api/dashboard/sales');
        const data = await response.json();
        
        if (response.ok && data.success) {
          setLeads(data.leads); // 2. Corrected to use setLeads
        } else {
          console.error("Failed to fetch data", data);
        }
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setIsLoading(false); // 3. This will now successfully clear the loading state
      }
    };

    fetchSalesData();
  }, []);

  // 4. Show a localized loading state before trying to render the table
  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 p-8 text-emerald-400 font-bold">Loading leads data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-emerald-400">Sales Dashboard</h1>
      <p className="text-gray-400 mb-8">Registered users pending loan application (Leads).</p>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Registration Date</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No pending leads found.</td></tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id} className="border-t border-gray-700">
                  <td className="px-6 py-4 font-medium">{lead.fullName}</td>
                  <td className="px-6 py-4">{lead.email}</td>
                  <td className="px-6 py-4">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button className="text-emerald-400 hover:text-emerald-300">Send Reminder</button>
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