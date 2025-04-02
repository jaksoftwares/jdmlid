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
  onUpdate: (updatedID: LostID) => void;  // ✅ Add this prop
}

const EditLostID = ({ isOpen, onClose, lostID, onUpdate }: EditLostIDProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<LostID> | null>(lostID);

  useEffect(() => {
    setFormData(lostID);
  }, [lostID]);

  const mutation = useMutation({
    mutationFn: async (updatedData: Partial<LostID>) => {
      if (!updatedData.id) throw new Error("Missing ID");
      return await api.updateLostID(updatedData.id, updatedData);
    },
    onSuccess: (updatedLostID) => {
      queryClient.setQueryData(["lostIDs"], (prev: LostID[] | undefined) =>
        prev
          ? prev.map((item) => (item.id === updatedLostID.id ? updatedLostID : item))
          : []
      );
      onUpdate(updatedLostID); // ✅ Call onUpdate to reflect changes
      alert("Lost ID updated successfully.");
      onClose();
    },
    onError: (error) => {
      console.error("Error updating lost ID:", error);
      alert("Failed to update Lost ID. Please try again.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData || !formData.id) return;
    mutation.mutate(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Lost ID">
      {formData ? (
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
            value={formData.status || ""}
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
