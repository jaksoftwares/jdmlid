"use client";
import { useState } from "react";

interface ReportFoundIDProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportFoundID: React.FC<ReportFoundIDProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null; // Prevent rendering when modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">Report Found ID</h2>

        {/* Form Fields */}
        {["id_number", "owner_name", "location_found", "date_found", "contact_info"].map((field) => (
          <div key={field} className="mb-3">
            <label className="block font-semibold capitalize">{field.replace(/_/g, " ")}</label>
            <input
              type={field === "date_found" ? "date" : "text"}
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
        ))}

        {/* Image Upload */}
        <div className="mb-3">
          <label className="block font-semibold">Upload ID Image</label>
          <input type="file" onChange={handleImageChange} className="border p-2 w-full rounded" />
          {imageFile && <p className="text-sm text-gray-500 mt-1">Selected: {imageFile.name}</p>}
        </div>

        {/* Comments */}
        <div className="mb-3">
          <label className="block font-semibold">Additional Comments</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            rows={3}
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Report Found ID
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFoundID;
