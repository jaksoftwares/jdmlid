"use client";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Category } from "@/types/types";

interface EditCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null; // ✅ Use full Category type to ensure type consistency
  onUpdate: (updatedCategory: Category) => void; // ✅ Expect full Category object
}

const EditCategory: React.FC<EditCategoryProps> = ({ isOpen, onClose, category, onUpdate }) => {
  const [name, setName] = useState("");
  const [recoveryFee, setRecoveryFee] = useState("");

  const queryClient = useQueryClient();

  // ✅ Prefill form when category changes
  useEffect(() => {
    if (category) {
      setName(category.name);
      setRecoveryFee(category.recovery_fee.toString());
    }
  }, [category]);

  // ✅ Mutation for Updating Category
  const mutation = useMutation({
    mutationFn: async (updatedCategory: { id: string; name: string; recovery_fee: number }) => {
      return { ...updatedCategory, created_at: category!.created_at }; // ✅ Ensure `created_at` is included
    },
    onMutate: async (updatedCategory) => {
      await queryClient.cancelQueries({ queryKey: ["idCategories"] });

      // ✅ Snapshot for rollback
      const previousCategories = queryClient.getQueryData<Category[]>(["idCategories"]);

      // ✅ Optimistic Update
      queryClient.setQueryData(["idCategories"], (old: Category[] | undefined) =>
        old
          ? old.map((cat) =>
              cat.id === updatedCategory.id ? { ...cat, ...updatedCategory } : cat
            )
          : []
      );

      return { previousCategories };
    },
    onSuccess: (updatedCategory) => {
      // ✅ Update cache
      queryClient.invalidateQueries({ queryKey: ["idCategories"] });

      // ✅ Pass full updated category to the parent
      onUpdate(updatedCategory);
    },
    onError: (error, updatedCategory, context) => {
      console.error("Error updating category:", error);
      if (context?.previousCategories) {
        // ❌ Rollback on failure
        queryClient.setQueryData(["idCategories"], context.previousCategories);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !recoveryFee) return alert("All fields are required!");

    mutation.mutate({
      id: category!.id,
      name,
      recovery_fee: parseFloat(recoveryFee),
    });

    onClose();
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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
