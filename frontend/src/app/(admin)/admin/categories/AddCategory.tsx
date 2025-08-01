"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import { Category } from "@/types/types";

interface AddCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newCategory: Category) => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [recoveryFee, setRecoveryFee] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newCategory: { name: string; recovery_fee: number }) => {
      return await api.addCategory(newCategory);
    },
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: ["idCategories"] });

      const previous = queryClient.getQueryData<Category[]>(["idCategories"]);

      // Optimistic update
      const tempCategory: Category = {
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...newCategory,
      };

      queryClient.setQueryData<Category[]>(["idCategories"], (old = []) => [...old, tempCategory]);

      return { previous };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Category[]>(["idCategories"], (old = []) =>
        old.map((cat) => (cat.id.startsWith("temp-") ? data : cat))
      );
      onAdd(data);
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["idCategories"], context.previous);
      }
      alert("❌ Failed to add category");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["idCategories"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !recoveryFee.trim()) {
      alert("All fields are required!");
      return;
    }

    mutation.mutate({
      name: name.trim(),
      recovery_fee: parseFloat(recoveryFee),
    });

    setName("");
    setRecoveryFee("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mt-1"
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Recovery Fee (KES)</label>
            <input
              type="number"
              min="0"
              value={recoveryFee}
              onChange={(e) => setRecoveryFee(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mt-1"
              placeholder="Enter recovery fee"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Adding..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
