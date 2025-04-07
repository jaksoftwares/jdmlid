'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope } from 'react-icons/fa';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Send password reset request
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Check your email for the password reset link.');
        setTimeout(() => {
          router.push('/auth/login'); // Redirect to login page after success
        }, 2000);
      } else {
        setError(data.error || 'Something went wrong, please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please check your connection and try again.');
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <FaEnvelope className="text-5xl text-jkuatGreen mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Forgot Your Password?</h1>
          <p className="text-gray-600">Enter your email and we will send you a link to reset your password.</p>
        </div>

        {message && <p className="text-green-600 text-center mt-3">{message}</p>}
        {error && <p className="text-red-600 text-center mt-3">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="flex items-center border rounded-lg px-4 py-3 bg-white">
            <FaEnvelope className="text-gray-500 mr-3" />
            <input
              type="email"
              placeholder="Email"
              className="w-full outline-none text-lg bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-jkuatGreen text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
