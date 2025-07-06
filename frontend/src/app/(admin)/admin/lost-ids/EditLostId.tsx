"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../components/Modal";
import api from "@/utils/api";
import { LostID } from "@/types/types";

interface EditLostIDProps {
  isOpen: boolean;
  onClose: () => void;
  lostID: LostID | null;
  onUpdate: (updatedID: LostID) => void;
}

const EditLostID = ({ isOpen, onClose, lostID, onUpdate }: EditLostIDProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<LostID>>({});

  useEffect(() => {
    if (lostID) {
      setFormData(lostID);
    }
  }, [lostID]);

  const mutation = useMutation({
    mutationFn: async (updatedData: Partial<LostID>) => {
      if (!updatedData.id) throw new Error("Missing ID");
      return await api.updateLostID(updatedData.id, updatedData);
    },
    onSuccess: (updatedLostID: LostID) => {
      alert("✅ Lost ID updated successfully.");
      onUpdate(updatedLostID);
      queryClient.invalidateQueries({ queryKey: ["lostIDs"] });
      onClose();
    },
    onError: (error: unknown) => {
      console.error("Error updating lost ID:", error);
      if (error instanceof Error) {
        alert(`❌ Failed to update Lost ID: ${error.message}`);
      } else {
        alert("❌ Failed to update Lost ID: Unknown error");
      }
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData?.id) {
      alert("❌ Missing ID. Cannot update.");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Lost ID">
      {formData && formData.id ? (
        <div className="space-y-4">
          <input
            type="text"
            name="owner_name"
            value={formData.owner_name || ""}
            onChange={handleChange}
            placeholder="Enter Owner Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="id_number"
            value={formData.id_number || ""}
            onChange={handleChange}
            placeholder="Enter ID Number"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="location_found"
            value={formData.location_found || ""}
            onChange={handleChange}
            placeholder="Enter Location Found"
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="date_found"
            value={formData.date_found || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <select
            name="status"
            value={formData.status || "Pending"}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Collected">Collected</option>
          </select>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            disabled={mutation.status === "pending"}
          >
            {mutation.status === "pending" ? "Saving..." : "Save Changes"}
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Modal>
  );
};

export default EditLostID;
