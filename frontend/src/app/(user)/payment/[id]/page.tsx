"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaArrowLeft, FaMobileAlt, FaCreditCard, FaPaypal, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import { ClaimData } from "@/types/types"; // Ensure this import is correct

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const paymentMethods = [
  { id: "mpesa", name: "M-Pesa (STK Push)", icon: <FaMobileAlt className="text-green-600" /> },
  { id: "airtel", name: "Airtel Money", icon: <FaMobileAlt className="text-red-500" /> },
  { id: "card", name: "Card Payment (Stripe)", icon: <FaCreditCard className="text-blue-600" /> },
  { id: "paypal", name: "PayPal", icon: <FaPaypal className="text-yellow-500" /> },
];

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const { "claim-id": claimId } = useParams();
  
  // Define the state with ClaimData type or null
  const [claimData] = useState<ClaimData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchClaimDetails = async () => {
      if (!claimId) return;

      const { data, error } = await supabase
        .from("claims")
        .select("name, email, phone, category_id, payment_status")
        .eq("id", claimId)
        .single();

      if (error || !data) {
        setError("Failed to load claim details.");
        setLoading(false);
        return;
      }

      // setClaimData(data); 
      setLoading(false);
    };

    fetchClaimDetails();
  }, [claimId]);

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError("Please select a payment method.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(async () => {
      console.log(`Processing payment for claim ID: ${claimId}`);

      const { error } = await supabase
        .from("claims")
        .update({ payment_status: "paid" })
        .eq("id", claimId);

      if (error) {
        setError("Payment failed. Please try again.");
        setLoading(false);
        return;
      }

      router.push(`/claim-id/${claimId}?paid=true`);
    }, 3000);
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading claim details...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 px-4 py-10">
      <div className="max-w-3xl mx-auto mb-6">
        <button onClick={() => router.back()} className="flex items-center text-green-600 hover:text-green-700 font-semibold">
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>

      <section className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-600">Payment for Claim</h2>
          <p className="text-gray-600 text-lg mt-2">
            You are claiming <strong>{claimData?.name}</strong>. Please complete the payment to proceed.
          </p>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold text-gray-700">Amount:</h3>
          <p className="text-gray-600 mt-1 text-2xl font-bold">KES 200</p>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold text-gray-700">Your Details:</h3>
          <div className="mt-2 text-gray-600">
            <p><strong>Name:</strong> {claimData?.name}</p>
            <p><strong>Email:</strong> {claimData?.email}</p>
            <p><strong>Phone:</strong> {claimData?.phone}</p>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold text-gray-700">Select Payment Method:</h3>
          <div className="grid grid-cols-2 gap-4 mt-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                className={`flex items-center justify-between px-4 py-3 border rounded-lg ${
                  selectedMethod === method.id ? "border-green-600 bg-green-50" : "hover:border-gray-400"
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                {method.icon} <span>{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedMethod === "mpesa" || selectedMethod === "airtel" ? (
          <div className="mt-6">
          <label className="block text-gray-700 font-semibold mb-2">Mobile Number:</label>
          <input
            type="tel"
            className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-green-300"
            value={`254${claimData?.phone || ''}`} 
            onChange={(e) => {
              const value = e.target.value;
              if (value.startsWith('254') && claimData) { 
                claimData.phone = value.slice(3); 
              }
            }}
            placeholder="7xxxxx"
          />
        </div>
        ) : null}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="mt-8 text-center">
          <button
            onClick={handlePayment}
            className={`inline-flex items-center ${
              selectedMethod ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            } text-white px-6 py-3 rounded-lg font-semibold transition`}
            disabled={!selectedMethod || loading}
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaCheckCircle className="mr-2" />}
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </section>
    </main>
  );
};

export default PaymentPage;
