import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../components/Modal";
import api, { NewLostID } from "@/utils/api";
import { LostID, Category } from "@/types/types";

interface AddLostIDProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newID: LostID) => void;
}

const AddLostID: React.FC<AddLostIDProps> = ({ isOpen, onClose, onAdd }) => {
  const queryClient = useQueryClient();

  const [newLostID, setNewLostID] = useState<NewLostID>({
    id_number: "",
    owner_name: "",
    category_id: "",
    location_found: "",
    date_found: "",
    status: "Pending",
    contact_info: "",
    comments: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

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
    mutationFn: async (lostID: NewLostID) => {
      setIsUploading(true);
      return await api.uploadLostID(lostID);
    },
    onSuccess: (response) => {
      setIsUploading(false);
      alert("✅ Lost ID added successfully!");
      onAdd(response);
      queryClient.invalidateQueries({ queryKey: ["lostIDs"] });
      resetForm();
      onClose();
    },
    onError: (error: unknown) => {
      setIsUploading(false);
      console.error("Upload Error:", error);
      if (error instanceof Error) {
        alert(`❌ Failed to upload Lost ID: ${error.message}`);
      } else {
        alert("❌ Failed to upload Lost ID: Unknown error");
      }
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewLostID((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const handleAddLostID = () => {
  const {
    id_number = "",
    owner_name = "",
    category_id = "",
    location_found = "",
    date_found = "",
    contact_info = ""
  } = newLostID;

  if (
    !id_number.trim() ||
    !owner_name.trim() ||
    !category_id.trim() ||
    !location_found.trim() ||
    !date_found.trim() ||
    !contact_info.trim()
  ) {
    alert("⚠️ All fields except comments are required.");
    return;
  }

  mutation.mutate(newLostID);
};

  const resetForm = () => {
    setNewLostID({
      id_number: "",
      owner_name: "",
      category_id: "",
      location_found: "",
      date_found: "",
      status: "Pending",
      contact_info: "",
      comments: "",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Lost ID">
      <div className="p-4">
        {["id_number", "owner_name", "location_found", "date_found", "contact_info", "comments"].map((field) => (
          <div key={field} className="mb-3">
            <label className="block font-semibold capitalize">{field.replace(/_/g, " ")}</label>
            {field === "comments" ? (
              <textarea
                name={field}
                value={newLostID[field as keyof NewLostID] || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            ) : (
              <input
                type={field === "date_found" ? "date" : "text"}
                name={field}
                value={newLostID[field as keyof NewLostID] || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            )}
          </div>
        ))}

        <div className="mb-3">
          <label className="block font-semibold">Category</label>
          <select
            name="category_id"
            value={newLostID.category_id}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAddLostID}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition mt-4 w-full"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Add Lost ID"}
        </button>
      </div>
    </Modal>
  );
};

export default AddLostID;
