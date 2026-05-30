'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        router.push('/login');
      } else {
        setError(data.error);
      }
    } catch (error: any) {
      setError('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-center text-white">Create Borrower Account</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <form onSubmit={onSignup} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">Full Name</label>
            <input 
              type="text" required
              className="w-full px-4 py-2 mt-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={user.fullName} onChange={(e) => setUser({...user, fullName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Email</label>
            <input 
              type="email" required
              className="w-full px-4 py-2 mt-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={user.email} onChange={(e) => setUser({...user, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Password</label>
            <input 
              type="password" required
              className="w-full px-4 py-2 mt-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={user.password} onChange={(e) => setUser({...user, password: e.target.value})}
            />
          </div>
          <button type="submit" disabled={loading} className="w-full px-4 py-2 font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Already have an account? <Link href="/login" className="text-emerald-400 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}