"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import { Category } from "@/types/types";

interface EditCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onUpdate: (updatedCategory: Category) => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({ isOpen, onClose, category, onUpdate }) => {
  const [name, setName] = useState("");
  const [recoveryFee, setRecoveryFee] = useState("");

  const queryClient = useQueryClient();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setRecoveryFee(category.recovery_fee.toString());
    }
  }, [category]);

  const mutation = useMutation({
    mutationFn: async (updatedCategory: { id: string; name: string; recovery_fee: number }) => {
      const response = await api.updateCategory(updatedCategory.id, {
        name: updatedCategory.name,
        recovery_fee: updatedCategory.recovery_fee,
      });
      return response;
    },
    onMutate: async (updatedCategory) => {
      await queryClient.cancelQueries({ queryKey: ["idCategories"] });

      const previousCategories = queryClient.getQueryData<Category[]>(["idCategories"]);

      queryClient.setQueryData<Category[]>(["idCategories"], (old = []) =>
        old.map((cat) =>
          cat.id === updatedCategory.id ? { ...cat, ...updatedCategory } : cat
        )
      );

      return { previousCategories };
    },
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData<Category[]>(["idCategories"], (old = []) =>
        old.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
      );
      onUpdate(updatedCategory);
    },
    onError: (_error, _updatedCategory, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["idCategories"], context.previousCategories);
      }
      alert("❌ Failed to update category");
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
      id: category!.id,
      name: name.trim(),
      recovery_fee: parseFloat(recoveryFee),
    });

    onClose();
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Category</h2>
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
              disabled={mutation.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {mutation.isPending ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
