'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send the login request
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, action: 'login' }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the session and user details to localStorage
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Get the returnTo URL from the query params
        const returnTo = searchParams.get('returnTo');

        // Redirect to the returnTo page if available, or to homepage
        router.push(returnTo || '/');
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please check your connection and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <FaUser className="text-5xl text-jkuatGreen mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600">Login to continue</p>
        </div>

        {error && <p className="text-red-600 text-center mt-3">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="flex items-center border rounded-lg px-4 py-3 bg-white">
            <FaUser className="text-gray-500 mr-3" />
            <input
              type="email"
              placeholder="Email"
              className="w-full outline-none text-lg bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded-lg px-4 py-3 bg-white">
            <FaLock className="text-gray-500 mr-3" />
            <input
              type="password"
              placeholder="Password"
              className="w-full outline-none text-lg bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-jkuatGreen text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Sign Up and Forgot Password Links */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/auth/signup" className="text-jkuatGreen font-semibold hover:underline">
              Sign Up
            </a>
          </p>
          <p className="text-gray-600 mt-2">
            Forgot your password?{' '}
            <a href="/auth/forgot-password" className="text-jkuatGreen font-semibold hover:underline">
              Reset it here
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
