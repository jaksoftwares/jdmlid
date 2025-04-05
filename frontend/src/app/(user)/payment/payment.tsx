'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api'; // Import the API call for payment initiation

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const lost_id = searchParams.get('lost_id');
  const amount = parseFloat(searchParams.get('amount') || '0');
  const user_id = searchParams.get('user_id');

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !amount || !lost_id || !user_id) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.initiatePayment(phone, amount, lost_id, user_id);

      if (response.status === 'success') {
        setPaymentStatus('Payment successful. Redirecting to submit claim...');
        setTimeout(() => {
          router.push(`/claim/submit?lost_id=${lost_id}`);
        }, 2000);
      } else {
        setPaymentStatus('Payment failed. Please try again.');
      }
    } catch (error) {
      setPaymentStatus('An error occurred. Please try again.');
      console.error('Payment initiation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-900">
      <h1 className="text-3xl font-bold text-green-600">Make a Payment</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm mt-8 space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 p-2 w-full border rounded-md"
            placeholder="Enter phone number"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (KES)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            readOnly
            className="mt-2 p-2 w-full border rounded-md bg-gray-100 text-gray-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>

        {paymentStatus && (
          <p className="text-center text-sm text-gray-700 mt-4">{paymentStatus}</p>
        )}
      </form>
    </main>
  );
};

export default PaymentPage;
