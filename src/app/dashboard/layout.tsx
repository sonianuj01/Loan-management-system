'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');

        const data = await response.json();

        console.log('STATUS:', response.status);
        console.log('DATA:', data);

        if (!response.ok || !data.success || !data.user) {
          router.replace('/login');
          return;
        }

        // Block borrowers from accessing dashboard
        if (data.user.role === 'Borrower') {
          router.replace('/');
          return;
        }

        setRole(data.user.role);
      } catch (error) {
        console.error('Auth verification failed:', error);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
        <p className="text-gray-400 font-medium">
          Verifying credentials...
        </p>
      </div>
    );
  }

  if (!role) {
    return null;
  }

  const navItems = [
    {
      name: 'Sales',
      href: '/dashboard/sales',
      allowedRoles: ['Admin', 'Sales'],
    },
    {
      name: 'Sanction',
      href: '/dashboard/sanction',
      allowedRoles: ['Admin', 'Sanction'],
    },
    {
      name: 'Disbursement',
      href: '/dashboard/disbursement',
      allowedRoles: ['Admin', 'Disbursement'],
    },
    {
      name: 'Collection',
      href: '/dashboard/collection',
      allowedRoles: ['Admin', 'Collection'],
    },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      router.replace('/login');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-emerald-400">
            LMS Internal
          </h2>

          <p className="text-xs text-gray-400 mt-1">
            Active Session:{' '}
            <span className="text-white font-semibold">{role}</span>
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            if (!item.allowedRoles.includes(role)) return null;

            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-emerald-600/20 text-emerald-400 font-bold border border-emerald-600/50'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="mb-4">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-semibold text-white">{role}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}