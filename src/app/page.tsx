import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let role: string | null = null;
  let borrowerName = '';

  if (token) {
    try {
      const decoded: any = jwt.verify(
        token,
        process.env.TOKEN_SECRET!
      );

      role = decoded.role;

      borrowerName =
        decoded.fullName ||
        'Borrower';

      // Redirect staff directly to dashboard
      if (
        role === 'Admin' ||
        role === 'Sales' ||
        role === 'Sanction' ||
        role === 'Disbursement' ||
        role === 'Collection'
      ) {
        redirect('/dashboard');
      }
    } catch (error) {
      console.log('Invalid token');
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-gray-100 px-6 py-10">
      {/* Hero Section */}
      <div className="max-w-4xl text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
          Next-Gen{' '}
          <span className="text-emerald-400">
            Lending Platform
          </span>
        </h1>

        <p className="text-lg text-gray-400">
          A full-stack Loan Management System handling
          end-to-end borrower applications and internal
          operational workflows.
        </p>
      </div>

      {/* Borrower Logged In */}
      {role === 'Borrower' ? (
        <div className="w-full flex justify-center">
          <div className="bg-gray-800 border border-emerald-500/20 rounded-3xl p-10 w-full max-w-2xl shadow-xl">

            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome Back 👋
            </h2>

            <p className="text-emerald-400 text-lg font-semibold mb-6">
              {borrowerName}
            </p>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-8">
              <h3 className="text-lg font-semibold text-white mb-2">
                Loan Services
              </h3>

              <p className="text-gray-400">
                Start a new loan application, upload
                salary documents, configure loan terms,
                and track your approval journey.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/apply/personal-details"
                className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold py-4 rounded-xl transition-colors"
              >
                Apply Loan
              </Link>

              <form
                action="/api/auth/logout"
                method="POST"
              >
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* Guest User */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">

          {/* Borrower Portal */}
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-emerald-500/50 transition-all flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-4">
              Borrower Portal
            </h2>

            <p className="text-gray-400 mb-8 flex-1">
              Need a loan? Register, check your
              eligibility instantly, and configure
              your loan terms with our live
              interactive calculator.
            </p>

            <Link
              href="/signup"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white text-center font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Operations Hub */}
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-4">
              Operations Hub
            </h2>

            <p className="text-gray-400 mb-8 flex-1">
              Secure internal dashboard for Sales,
              Sanction, Disbursement, and Collection
              executives. Role-based access enforced.
            </p>

            <Link
              href="/login"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Staff Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}