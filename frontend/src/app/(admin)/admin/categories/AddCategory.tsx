"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import { Category } from "@/types/types"; // Ensure you have a proper Category type

interface AddCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newCategory: Category) => void; // ✅ Add the missing prop
}

const AddCategory: React.FC<AddCategoryProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [recoveryFee, setRecoveryFee] = useState("");

  const queryClient = useQueryClient();

  // ✅ Mutation with Optimistic UI Update
  const mutation = useMutation({
    mutationFn: async (newCategory: { name: string; recovery_fee: number }) => {
      const response = await api.addCategory(newCategory);
      return response;
    },
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: ["idCategories"] });

      const previousCategories = queryClient.getQueryData<Category[]>(["idCategories"]);

      const tempCategory: Category = {
          id: `temp-${Date.now()}`,
          ...newCategory,
          created_at: ""
      };

      queryClient.setQueryData(["idCategories"], (old: Category[] | undefined) =>
        old ? [...old, tempCategory] : [tempCategory]
      );

      return { previousCategories };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["idCategories"], (old: Category[] | undefined) =>
        old ? old.map((cat) => (cat.id.startsWith("temp-") ? data : cat)) : [data]
      );

      // ✅ Call onAdd with the new category
      onAdd(data);
    },
    onError: (error, newCategory, context) => {
      console.error("Error adding category:", error);
      if (context?.previousCategories) {
        queryClient.setQueryData(["idCategories"], context.previousCategories);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["idCategories"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !recoveryFee) return alert("All fields are required!");

    mutation.mutate({
      name,
      recovery_fee: parseFloat(recoveryFee),
    });

    setName("");
    setRecoveryFee("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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
