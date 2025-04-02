"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";

const PaymentPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const lost_id = searchParams.get("lost_id") || "";
  const amount = searchParams.get("amount") || "200";

  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    setTimeout(() => {
      setPaid(true);
      setLoading(false);
      
      // Redirect back to Claim Page after 2 seconds
      setTimeout(() => {
        router.push(`/claim/${lost_id}?paid=true`);
      }, 2000);
    }, 3000);
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-900">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center">
        <FaMoneyBillWave className="text-5xl text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold">Complete Your Payment</h2>
        <p className="text-gray-600 mt-2">Pay <span className="font-bold text-red-500">KES {amount}</span> to proceed with your claim.</p>

        {!paid ? (
          <button
            onClick={handlePayment}
            className="mt-6 bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
            disabled={loading}
          >
            {loading ? "Processing Payment..." : "Pay Now"}
          </button>
        ) : (
          <div className="mt-6">
            <FaCheckCircle className="text-4xl text-green-600 mx-auto mb-2" />
            <p className="text-green-600 font-semibold">Payment Successful!</p>
            <p className="text-gray-600 text-sm mt-1">Redirecting to claim page...</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default PaymentPage;
