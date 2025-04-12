"use client";

import { useState } from "react";
import Link from "next/link";

const ReportFoundID = () => {
  const [formData, setFormData] = useState({
    id_number: "",
    owner_name: "",
    location_found: "",
    date_found: "",
    contact_info: "",
    comments: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    alert("This is a static form. Submission will be implemented later.");
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Report Found ID</h1>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            &larr; Back
          </Link>
        </div>

        {/* Form Fields */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {["id_number", "owner_name", "location_found", "date_found", "contact_info"].map((field) => (
            <div key={field} className="mb-4">
              <label className="block font-medium mb-2 capitalize">
                {field.replace(/_/g, " ")}
              </label>
              <input
                type={field === "date_found" ? "date" : "text"}
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          ))}

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Upload ID Image</label>
            <input 
              type="file" 
              onChange={handleImageChange} 
              className="w-full p-2 border rounded-md"
              accept="image/*"
            />
            {imageFile && <p className="mt-2 text-sm text-gray-600">Selected: {imageFile.name}</p>}
          </div>

          {/* Comments */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Additional Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/"
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ReportFoundID;