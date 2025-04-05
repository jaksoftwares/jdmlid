'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api'; // Import the API call for payment initiation

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Getting query params (if needed, adjust accordingly)
  const lost_id = searchParams.get('lost_id');
  const amount = parseFloat(searchParams.get('amount') || '0');
  const user_id = searchParams.get('user_id');

  // States for form inputs and payment status
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
      // Initiate payment via MPESA API (call your backend API here)
      const response = await api.initiatePayment(phone, amount, lost_id, user_id);

      if (response.status === 'success') {
        setPaymentStatus('Payment successful. Redirecting to submit claim...');
        // Redirect to the claim page after successful payment
        setTimeout(() => {
          router.push(`/claim/submit?lost_id=${lost_id}`);
        }, 2000); // 2-second delay before redirect
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
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount to Pay
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            readOnly
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Amount"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full py-2 px-4 bg-green-600 text-white rounded-md"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>

      {paymentStatus && (
        <div className="mt-4">
          <p className="text-lg">{paymentStatus}</p>
        </div>
      )}
    </main>
  );
};

export default PaymentPage;
