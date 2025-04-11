'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const lost_id = searchParams.get('lost_id');
  const amount = parseFloat(searchParams.get('amount') || '0');
  const user_id = searchParams.get('user_id');

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [waitingForPayment, setWaitingForPayment] = useState(false); // For the waiting state

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^254\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Function to check payment status periodically
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkPaymentStatus = async () => {
    if (!lost_id) {
      setPaymentStatus('Lost ID is missing.');
      return;
    }
  
    try {
      const response = await api.checkPaymentStatus(lost_id);
  
      if (response && response.status === 'confirmed') {
        setPaymentStatus('Payment confirmed! You can now submit your claim.');
        setTimeout(() => {
          router.push(`/claim/submit?lost_id=${lost_id}`);
        }, 2000);
      } else {
        setPaymentStatus('Payment not confirmed yet. Please wait...');
      }
    } catch (error) {
      setPaymentStatus('Error checking payment status. Please try again.');
      console.error('Error checking payment status:', error);
    }
  };

  useEffect(() => {
    if (waitingForPayment) {
      const interval = setInterval(async () => {
        await checkPaymentStatus();
      }, 3000); // Check every 3 seconds for payment confirmation

      return () => clearInterval(interval); // Clean up interval on component unmount
    }
  }, [checkPaymentStatus, waitingForPayment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !amount || !lost_id || !user_id) {
      alert('Please ensure all fields are filled correctly.');
      return;
    }

    // Ensure phone number is in the correct format '254XXXXXXXXX'
    const formattedPhone = `254${phone.slice(0, 9)}`;

    if (!validatePhoneNumber(formattedPhone)) {
      alert('Please enter a valid Kenyan phone number starting with 254.');
      return;
    }

    setLoading(true);
    setPaymentStatus('Sending payment request... Please check your phone for the payment prompt.');
    setWaitingForPayment(true); // Start waiting for payment status

    try {
      const response = await api.initiatePayment(formattedPhone, amount, lost_id, user_id);

      console.log("Payment initiation response:", response);

      // Check for successful payment initiation response
      if (response.message === "STK Push initiated successfully") {
        setPaymentStatus('Payment initiated successfully. Please check your phone and confirm the payment.');
      } else {
        setPaymentStatus('Payment failed. Please try again.');
        console.error('Payment failed response:', response);
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
      <h1 className="text-4xl font-bold text-green-600">Make Your Payment</h1>
      <p className="mt-2 text-sm text-gray-600">Please enter your Mpesa number below to complete the payment process.</p>

      <form onSubmit={handleSubmit} className="w-full max-w-md mt-8 space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Mpesa Number (e.g., 2547xxxxxxx)
          </label>
          <input
            id="phone"
            type="tel"
            value={`254${phone || ''}`} // Ensure '254' is pre-filled, and handle null or undefined phone
            onChange={(e) => setPhone(e.target.value.slice(3))} // Only update the part after '254'
            className="mt-2 p-3 w-full border rounded-md focus:ring focus:ring-green-300 focus:border-green-500"
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
            className="mt-2 p-3 w-full border rounded-md bg-gray-100 text-gray-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading || waitingForPayment} // Disable button while waiting
          className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>

        {paymentStatus && (
          <p className={`text-center text-sm mt-4 ${paymentStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {paymentStatus}
          </p>
        )}
      </form>
    </main>
  );
};

export default PaymentPage;
