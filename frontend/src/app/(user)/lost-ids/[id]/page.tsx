"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaIdCard, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import api from "@/utils/api";
import { LostID } from "@/types/types";

const LostIDDetails = () => {
  const params = useParams(); // Get dynamic route params
  const router = useRouter();
  const id = params.id as string; // Ensure ID is a string

  const [idDetails, setIdDetails] = useState<LostID | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    console.log("Fetching details for ID:", id);

    const fetchIdDetails = async () => {
      try {
        setLoading(true);
        const fetchedID = await api.fetchLostIDById(id);
        setIdDetails(fetchedID);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load ID details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIdDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-600">Loading ID details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!idDetails) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg text-gray-600 mb-4">ID not found.</p>
        <button
          onClick={() => router.push("/lost-ids")}
          className="bg-jkuatGreen text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          aria-label="Back to lost ID listings"
        >
          Back to Listings
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 px-4 py-10">
      {/* Back Button */}
      <div className="max-w-3xl mx-auto mb-6">
        <button
          onClick={() => router.push("/lost-ids")}
          className="flex items-center text-jkuatGreen hover:text-green-600 font-semibold"
          aria-label="Back to lost ID listings"
        >
          <FaArrowLeft className="mr-2" /> Back to Listings
        </button>
      </div>
  
      {/* ID Details Card */}
      <section className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <FaIdCard className="text-5xl text-jkuatGreen mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-jkuatGreen">{idDetails.owner_name}</h2>
          <p className="text-gray-600 text-lg">{idDetails.status}</p>
        </div>
  
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold text-gray-700">Found At:</h3>
          <p className="flex items-center text-gray-600 mt-1">
            <FaMapMarkerAlt className="mr-2 text-jkuatYellow" />
            {idDetails.location_found}
          </p>
        </div>
  
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold text-gray-700">Date Found:</h3>
          <p className="text-gray-600 mt-2">
            {new Date(idDetails.date_found).toLocaleDateString()}
          </p>
        </div>
  
        {/* Blurred ID Number Section */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold text-gray-700">ID Number:</h3>
          <p className="text-gray-600 mt-1">
            <span className="blur-sm">{idDetails.id_number}</span>
          </p>
        </div>
  
        {/* Claim ID Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push(`/claim-id/${idDetails.id}`)} // Navigate to claim page of that specific ID
            className="inline-flex items-center bg-jkuatYellow text-jkuatGreen px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
            aria-label="Claim this ID"
          >
            <FaCheckCircle className="mr-2" /> Claim ID
          </button>
        </div>
      </section>
    </main>
  );
  
};

export default LostIDDetails;
