"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import DeleteCategory from "./DelereCategory";
import CategoryTable from "./CategoryTable";
import { Category } from "@/types/types";

const CategoriesPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const queryClient = useQueryClient();

  // Fetch ID Categories
  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ["idCategories"],
    queryFn: api.fetchIDCategories,
    staleTime: 10 * 60 * 1000,
  });

  // Helpers for stats
  const highestFee = categories.length ? Math.max(...categories.map(c => c.recovery_fee)) : 0;
  const lowestFee = categories.length ? Math.min(...categories.map(c => c.recovery_fee)) : 0;

  return (
    <div className="container mx-auto p-6 pl-0">
      <h1 className="text-3xl font-bold mb-6 text-left">ID Categories Management</h1>

      {isLoading && <p>Loading categories...</p>}
      {isError && <p className="text-red-500">Error loading categories.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg text-center shadow">
          <h2 className="text-lg font-semibold">Total Categories</h2>
          <p className="text-2xl font-bold">{categories.length}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center shadow">
          <h2 className="text-lg font-semibold">Highest Recovery Fee</h2>
          <p className="text-2xl font-bold">KES {highestFee}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center shadow">
          <h2 className="text-lg font-semibold">Lowest Recovery Fee</h2>
          <p className="text-2xl font-bold">KES {lowestFee}</p>
        </div>
      </div>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition mb-6"
      >
        + Add New Category
      </button>

      <CategoryTable
        categories={categories}
        onEdit={(category) => {
          setSelectedCategory(category);
          setIsEditModalOpen(true);
        }}
        onDelete={(category) => {
          setSelectedCategory(category);
          setIsDeleteModalOpen(true);
        }}
      />

      <AddCategory
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(newCategory: Category) => {
          queryClient.setQueryData<Category[]>(["idCategories"], (prev = []) => [...prev, newCategory]);
        }}
      />

      <EditCategory
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={selectedCategory}
        onUpdate={(updatedCategory: Category) => {
          queryClient.setQueryData<Category[]>(["idCategories"], (prev = []) =>
            prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
          );
        }}
      />

      <DeleteCategory
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
};

export default CategoriesPage;
