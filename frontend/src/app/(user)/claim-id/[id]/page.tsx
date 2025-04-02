"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaCheckCircle, FaIdCard, FaInfoCircle, FaMoneyBillWave } from "react-icons/fa";

interface LostID {
  id: string;
  category_id: string;
  name: string;
  category: string;
  location: string;
}

// Simulated lost ID data
const lostIDs: LostID[] = [
  { id: "1", category_id: "101", name: "John Doe", category: "School ID", location: "JKUAT Library" },
  { id: "2", category_id: "102", name: "Jane Smith", category: "National ID", location: "Gate C Security" },
];

const ClaimIDPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [idDetails, setIdDetails] = useState<LostID | null>(null);
  const [formData, setFormData] = useState({
    lost_id: id || "", // Prefilled Lost ID UUID
    category_id: "", // Prefilled Category ID
    name: "",
    email: "",
    phone: "",
    comments: "",
  });
  const [isPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const foundID = lostIDs.find((item) => item.id === id);
      if (foundID) {
        setIdDetails(foundID);
        setFormData((prev) => ({
          ...prev,
          lost_id: foundID.id,
          category_id: foundID.category_id,
        }));
      }
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    const paymentUrl = `/payment?lost_id=${formData.lost_id}&category_id=${formData.category_id}&amount=200`;
    router.push(paymentUrl);
  };

  const handleSubmit = async () => {
    if (!isPaid) return alert("Please complete the payment first!");
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claims/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit claim.");
      
      alert("Claim submitted successfully!");
      router.push("/"); 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Error submitting claim. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!idDetails) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-900">
        <FaInfoCircle className="text-5xl text-red-500 mb-4" />
        <p className="text-lg text-gray-600 mb-4">ID not found.</p>
        <Link href="/lost-ids" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
          Back to Lost IDs
        </Link>
      </main>
    );
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
          <FaIdCard className="text-5xl text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-green-600">{idDetails.name}</h2>
          <p className="text-gray-600 text-lg">{idDetails.category}</p>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold text-gray-700">Location Found:</h3>
          <p className="text-gray-600 mt-1">{idDetails.location}</p>
        </div>

        <div className="mt-6 border-t pt-4 text-center text-yellow-600 font-semibold">
          <p>⚠️ A service fee of <span className="text-red-500">KES 200</span> is required to claim this ID.</p>
        </div>

        <form className="mt-6 border-t pt-4 space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Claim Form:</h3>

          {/* Prefilled Hidden Fields */}
          <input type="hidden" name="lost_id" value={formData.lost_id} />
          <input type="hidden" name="category_id" value={formData.category_id} />

          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-green-300"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-green-300"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-green-300"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <textarea
            name="comments"
            placeholder="Additional Comments (Optional)"
            rows={3}
            className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-green-300"
            value={formData.comments}
            onChange={handleChange}
          ></textarea>
        </form>

        <div className="mt-8 text-center space-y-4">
          {!isPaid ? (
        <button
        onClick={handlePayment}
        className="inline-flex items-center bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
      >
        <FaMoneyBillWave className="mr-2" /> Pay KES 200 & Proceed
      </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Submitting..." : <><FaCheckCircle className="mr-2" /> Submit Claim</>}
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

export default ClaimIDPage;
