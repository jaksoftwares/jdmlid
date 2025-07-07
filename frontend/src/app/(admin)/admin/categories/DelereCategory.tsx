"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import { Category } from "@/types/types";

interface DeleteCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  category: { id: string; name: string } | null;
}

const DeleteCategory: React.FC<DeleteCategoryProps> = ({ isOpen, onClose, category }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (categoryId: string) => {
      return await api.deleteCategory(categoryId);
    },
    onMutate: async (categoryId) => {
      await queryClient.cancelQueries({ queryKey: ["idCategories"] });

      const previous = queryClient.getQueryData<Category[]>(["idCategories"]);

      queryClient.setQueryData<Category[]>(["idCategories"], (old = []) =>
        old.filter((cat) => cat.id !== categoryId)
      );

      return { previous };
    },
    onError: (error, _categoryId, context) => {
      console.error("Error deleting category:", error);
      if (context?.previous) {
        queryClient.setQueryData(["idCategories"], context.previous);
      }
      alert("❌ Failed to delete category");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["idCategories"] });
    },
  });

  const handleDelete = () => {
    if (category) {
      mutation.mutate(category.id);
      onClose();
    }
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>
        <p className="text-gray-700">
          Are you sure you want to delete the category <strong>{category.name}</strong>?
        </p>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={mutation.isPending}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategory;
