'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PersonalDetailsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    pan: '',
    age: '',
    monthlySalary: '',
    employmentMode: 'Salaried'
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Call the server-side BRE Engine API
    const response = await fetch('/api/borrower/bre-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        age: Number(formData.age),
        monthlySalary: Number(formData.monthlySalary)
      })
    });

    const data = await response.json();

    if (!data.passed) {
      setErrors(data.errors); // Display exact rejection reasons
      return;
    }

    // If passed, move to step 3
    router.push('/apply/upload');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-2">Step 2: Personal Details</h1>
        <p className="text-gray-400 text-sm mb-6">Let's check your eligibility.</p>

        {errors.length > 0 && (
          <div className="p-4 mb-4 text-sm text-red-400 bg-red-900/50 rounded-lg border border-red-800">
            <ul className="list-disc pl-5">
              {errors.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">Full Name</label>
            <input type="text" required
              className="w-full px-4 py-2 mt-1 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-500"
              value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300">PAN Number</label>
              <input type="text" required placeholder="ABCDE1234F"
                className="w-full px-4 py-2 mt-1 bg-gray-700 text-white rounded-lg uppercase focus:ring-2 focus:ring-emerald-500"
                value={formData.pan} onChange={(e) => setFormData({...formData, pan: e.target.value.toUpperCase()})}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300">Age</label>
              <input type="number" required
                className="w-full px-4 py-2 mt-1 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-500"
                value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300">Monthly Salary (₹)</label>
              <input type="number" required
                className="w-full px-4 py-2 mt-1 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-500"
                value={formData.monthlySalary} onChange={(e) => setFormData({...formData, monthlySalary: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300">Employment</label>
              <select 
                className="w-full px-4 py-2 mt-1 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-500"
                value={formData.employmentMode} onChange={(e) => setFormData({...formData, employmentMode: e.target.value})}
              >
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="w-full px-4 py-3 mt-4 font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">
            Check Eligibility & Continue
          </button>
        </form>
      </div>
    </div>
  );
}