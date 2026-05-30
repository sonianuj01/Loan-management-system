'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userRole', data.role);

        // Dynamic Routing Logic
        switch (data.role) {
          case 'Admin':
            router.push('/dashboard/sales'); // Or a general dashboard
            break;
          case 'Sales':
            router.push('/dashboard/sales');
            break;
          case 'Sanction':
            router.push('/dashboard/sanction');
            break;
          case 'Disbursement':
            router.push('/dashboard/disbursement');
            break;
          case 'Collection':
            router.push('/dashboard/collection');
            break;
          default:
            router.push('/dashboard/sales'); // Fallback
        }
      
      } else {
      setError(data.error);
    }
  } catch (error: any) {
    setError('Login failed. Try again.');
  }
};

return (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h1 className="text-2xl font-bold text-center text-white">LMS Portal Login</h1>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <form onSubmit={onLogin} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 mt-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 mt-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">
          Login
        </button>
      </form>
    </div>
  </div>
);
}