"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaCheckCircle, FaIdCard, FaInfoCircle, FaMoneyBillWave } from "react-icons/fa";
import api from "@/utils/api";
import { LostID, Category, ClaimFormData } from "@/types/types";
import { useAuth } from "@/contexts/AuthContext";

type IDetails = {
  owner_name: string;
  category: string;
  location_found: string;
  category_price: number;
};

const ClaimIDPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const safeId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();

  const [idDetails, setIdDetails] = useState<IDetails | null>(null);
  const [formData, setFormData] = useState<ClaimFormData>({
    lost_id: safeId || "",
    category_id: "",
    name: "",
    email: "",
    phone: "",
    comments: "",
  });
  const [isPaid] = useState(false);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [formError, setFormError] = useState<string | null>(null); // For form validation

  useEffect(() => {
    if (!safeId) return;

    const fetchIdDetails = async () => {
      setLoading(true);
      try {
        if (typeof safeId !== 'string') {
          throw new Error('Invalid ID');
        }

        const response: LostID = await api.fetchLostIDById(safeId);
        const categoryId = typeof response.category_id === 'string' ? response.category_id : "";
        const categoryResponse: Category = await api.fetchCategoryById(categoryId);

        const idDetails: IDetails = {
          owner_name: response.owner_name,
          category: categoryResponse.name || "Uncategorized",
          location_found: response.location_found,
          category_price: categoryResponse.recovery_fee || 200,
        };

        setFormData((prevData: ClaimFormData) => ({
          ...prevData,
          lost_id: response.id,
          category_id: categoryId,
        }));

        setIdDetails(idDetails);
      } catch (err) {
        console.error("Error fetching ID details:", err);
        setIdDetails(null);
      } finally {
        setLoading(false); // Always stop loading
      }
    };

    fetchIdDetails();
  }, [safeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    if (!user) {
      router.push(`/auth/login?returnTo=/claim-id/${safeId}`);
      return;
    }
  
    if (!formData.name || !formData.email || !formData.phone) {
      setFormError("Please fill in all the required fields.");
      return;
    }
  
    setFormError(null);
    if (!idDetails) return;
  
    const paymentUrl = `/payment?lost_id=${formData.lost_id}&category_id=${formData.category_id}&amount=${idDetails.category_price}&user_id=${user.id}`;
  
    router.push(paymentUrl);
  };

  const handleSubmit = async () => {
    if (!isPaid) {
      alert("Please complete the payment first!");
      return;
    }

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

  // ✅ Show loading state while fetching
  if (loading) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-900">
        <p className="text-lg text-gray-600 mb-4">Loading ID details...</p>
      </main>
    );
  }

  // ✅ Show 'ID not found' only after loading is false
  if (!idDetails) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-900">
        <FaInfoCircle className="text-5xl text-red-500 mb-4" />
        <p className="text-lg text-gray-600 mb-4">ID not found.</p>
        <button
          onClick={() => router.push("/lost-ids")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Back to Lost IDs
        </button>
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
          <h2 className="text-3xl font-bold text-green-600">{idDetails.owner_name}</h2>
          <p className="text-gray-600 text-lg">{idDetails.category}</p>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold text-gray-700">Location Found:</h3>
          <p className="text-gray-600 mt-1">{idDetails.location_found}</p>
        </div>

        <div className="mt-6 border-t pt-4 text-center text-yellow-600 font-semibold">
          <p>⚠️ A service fee of <span className="text-red-500">KES {idDetails.category_price}</span> is required to claim this ID.</p>
        </div>

        <form className="mt-6 border-t pt-4 space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Claim Form:</h3>

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

          {/* Display error if the form is incomplete */}
          {formError && (
            <div className="text-red-500 text-sm mt-2">
              <p>{formError}</p>
            </div>
          )}
        </form>

        <div className="mt-8 text-center space-y-4">
          {!isPaid ? (
            <button
              onClick={handlePayment}
              className="inline-flex items-center bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
              <FaMoneyBillWave className="mr-2" /> Pay KES {idDetails.category_price} & Proceed
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
