import { Category } from "@/types/types";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Category Name</th>
            <th className="p-3 text-left">Recovery Fee (KES)</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No categories found.
              </td>
            </tr>
          ) : (
            categories.map((category, index) => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{category.name}</td>
                <td className="p-3">{category.recovery_fee}</td>
                <td className="p-3">
                  <button
                    onClick={() => onEdit(category)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(category)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
