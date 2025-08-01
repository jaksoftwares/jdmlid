"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../components/Modal";
import api from "@/utils/api";
import { LostID, Category } from "@/types/types";

interface EditLostIDProps {
  isOpen: boolean;
  onClose: () => void;
  lostID: LostID | null;
  onUpdate: (updatedID: LostID) => void;
}

const EditLostID = ({ isOpen, onClose, lostID, onUpdate }: EditLostIDProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<LostID>>({});
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (lostID) {
      setFormData(lostID);
    }
  }, [lostID]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.fetchIDCategories?.();
        if (response && Array.isArray(response)) {
          setCategories(response);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: async (updatedData: Partial<LostID>) => {
      if (!updatedData.id) throw new Error("Missing ID");
      return await api.updateLostID(updatedData.id, updatedData);
    },
    onMutate: async (updatedData) => {
      await queryClient.cancelQueries({ queryKey: ["lostIDs"] });
      const previousLostIDs = queryClient.getQueryData<LostID[]>(["lostIDs"]);

      // Optimistic cache update
      queryClient.setQueryData(["lostIDs"], (old: LostID[] | undefined) =>
        old
          ? old.map((id) =>
              id.id === updatedData.id ? { ...id, ...updatedData } : id
            )
          : []
      );

      return { previousLostIDs };
    },
    onSuccess: (updatedLostID) => {
      alert("✅ Lost ID updated successfully.");
      onUpdate(updatedLostID);

      // No need for invalidateQueries — cache is already updated
      onClose();
    },
    onError: (error, updatedData, context) => {
      console.error("Error updating lost ID:", error);
      alert("❌ Failed to update Lost ID. Reverting changes.");

      // Rollback
      if (context?.previousLostIDs) {
        queryClient.setQueryData(["lostIDs"], context.previousLostIDs);
      }
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
            placeholder="Owner Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="id_number"
            value={formData.id_number || ""}
            onChange={handleChange}
            placeholder="ID Number"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="location_found"
            value={formData.location_found || ""}
            onChange={handleChange}
            placeholder="Location Found"
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="date_found"
            value={formData.date_found || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="contact_info"
            value={formData.contact_info || ""}
            onChange={handleChange}
            placeholder="Contact Info"
            className="w-full p-2 border rounded"
          />
          <textarea
            name="comments"
            value={formData.comments || ""}
            onChange={handleChange}
            placeholder="Comments"
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
          <select
            name="category_id"
            value={formData.category_id || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Modal>
  );
};

export default EditLostID;
