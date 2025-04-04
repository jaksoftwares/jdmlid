import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../components/Modal";
import api from "@/utils/api";
import { LostID, NewLostID, Category } from "@/types/types";  // Ensure NewLostID is imported

interface AddLostIDProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newID: LostID) => void;
}

const AddLostID: React.FC<AddLostIDProps> = ({ isOpen, onClose, onAdd }) => {
  const queryClient = useQueryClient();

  const [newLostID, setNewLostID] = useState<LostID>({
    id: "", 
    id_number: "",
    owner_name: "",
    category_id: "", // Must be included
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
        const response = await api.fetchIDCategories();
        if (response && Array.isArray(response)) {
          setCategories(response);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const mutation = useMutation({
    mutationFn: async (lostID: NewLostID) => {
      setIsUploading(true);
      return await api.uploadLostID(lostID); // Upload NewLostID object
    },
    onSuccess: (response) => {
      setIsUploading(false);
      if ('error' in response) {
        alert(`Error: ${response.error || "Something went wrong"}`);
      } else {
        alert("Lost ID added successfully!");
        onAdd(response);
        queryClient.setQueryData(["lostIDs"], (prev: LostID[] | undefined) =>
          prev ? [...prev, response] : [response]
        );
        setNewLostID({
          id: "",
          id_number: "",
          owner_name: "",
          category_id: "",
          location_found: "",
          date_found: "",
          status: "Pending",
          contact_info: "",
          comments: "",
        });
        onClose();
      }
    },
    onError: (error) => {
      console.error("Upload Error:", error);
      alert("Failed to upload Lost ID. Please try again.");
      setIsUploading(false);
    },
  });
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "category_id") {
      setNewLostID((prev) => ({
        ...prev,
        category_id: value,  // Store selected category ID
      }));
    } else {
      setNewLostID((prev) => ({
        ...prev,
        [name as keyof typeof newLostID]: value,
      }));
    }
  };

  const handleAddLostID = async () => {
    // Ensure all required fields are filled
    if (
      !newLostID.id_number ||
      !newLostID.owner_name ||
      !newLostID.category_id ||  // category_id is required
      !newLostID.location_found ||
      !newLostID.date_found
    ) {
      alert("All fields except comments are required.");
      return;
    }
  
    try {
      // Pass newLostID directly to the mutation
      mutation.mutate(newLostID);  // Submit the NewLostID object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Failed to upload Lost ID. Please try again.");
    }
  };
  
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Lost ID">
      <div className="p-4">
        {["id_number", "owner_name", "location_found", "date_found", "contact_info", "comments"].map((field) => (
          <div key={field} className="mb-3">
            <label className="block font-semibold capitalize">{field.replace(/_/g, " ")}</label>
            <input
              type={field === "date_found" ? "date" : "text"}
              name={field}
              value={newLostID[field as keyof typeof newLostID]}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
        ))}

        {/* Category Selection */}
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
