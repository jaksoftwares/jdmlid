import { Category } from "@/types/types"; // ✅ Use the existing type

const BASE_URL = "http://localhost:5000"; // Update when deploying

// **LOST ID ENDPOINTS**
const LOST_ID_URL = `${BASE_URL}/lost-ids`;

// **CATEGORY ENDPOINTS**
const CATEGORY_URL = `${BASE_URL}/categories`;

// ✅ Define Lost ID type
interface LostID {
    id: string;
    id_number: string;
    owner_name: string;
    location_found: string;
    date_found: string;
    status: string;
    contact_info: string;
    comments: string;
}

// ✅ Reusable API Fetch Helper
const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "An error occurred");
    return data;
};

// =============================
// ✅ LOST ID FUNCTIONS
// =============================

// 🔄 Fetch Lost IDs (with caching)
let cachedLostIDs: LostID[] | null = null;
let lastLostIDFetch = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const fetchLostIDs = async (): Promise<LostID[]> => {
    const now = Date.now();
    if (cachedLostIDs && now - lastLostIDFetch < CACHE_DURATION) {
        console.log("Returning cached Lost IDs...");
        return cachedLostIDs;
    }

    try {
        console.log("Fetching Lost IDs from API...");
        const response = await fetch(LOST_ID_URL);
        const data = await handleResponse(response);

        // Cache result
        cachedLostIDs = data;
        lastLostIDFetch = now;

        return data;
    } catch (error) {
        console.error("Error fetching Lost IDs:", error);
        return [];
    }
};

const fetchLostIDById = async (id: string): Promise<LostID> => {
    try {
        const response = await fetch(`${LOST_ID_URL}/id/${id}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await handleResponse(response);
    } catch (error) {
        console.error("Error fetching Lost ID by ID:", error);
        throw error;
    }
};


// 🔍 Search Lost IDs
const searchLostIDs = async (query: string): Promise<LostID[]> => {
    try {
        const response = await fetch(`${LOST_ID_URL}/search?query=${query}`);
        return await handleResponse(response);
    } catch (error) {
        console.error("Error searching Lost IDs:", error);
        return [];
    }
};

// 📤 Upload Lost ID (Updated: Now sends JSON instead of FormData)
// 📤 Upload Lost ID (Updated: Now sends JSON instead of FormData)
const uploadLostID = async (lostIDData: Omit<LostID, "id">): Promise<LostID | { message: string; error: string }> => {
    try {
        const response = await fetch(`${LOST_ID_URL}/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lostIDData),
        });

        // Ensure response is handled correctly
        const data = await response.json();  // Use .json() directly here

        console.log("Server Response:", data); // Log the server response

        if (response.ok) {
            // Check if the response contains the expected 'lostId' object
            if (data.lostId && data.lostId.id && data.lostId.id_number) {
                return data.lostId; // Return the full LostID object
            } else {
                // Handle unexpected data structure (e.g., missing fields)
                return { message: "Failed to upload Lost ID", error: "Unexpected data format" };
            }
        } else {
            // If the response status is not OK (400, 500, etc.), return the error message from the server
            return { message: "Failed to upload Lost ID", error: data?.error || "Unknown error" };
        }
    } catch (error) {
        console.error("Error uploading Lost ID:", error);
        return { message: "Failed to upload Lost ID", error: error instanceof Error ? error.message : "Unknown error" };
    }
};

  
// ✏️ Update Lost ID
const updateLostID = async (id: string, updateData: Partial<LostID>): Promise<LostID> => {
    try {
        const response = await fetch(`${LOST_ID_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error updating Lost ID:", error);
        throw error;
    }
};

// 🗑 Delete Lost ID
const deleteLostID = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await fetch(`${LOST_ID_URL}/${id}`, { method: "DELETE" });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error deleting Lost ID:", error);
        throw error;
    }
};

// =============================
// ✅ CATEGORY FUNCTIONS
// =============================

// 🔄 Fetch all categories
const fetchIDCategories = async (): Promise<Category[]> => {
    try {
        console.log("Fetching ID Categories...");
        const response = await fetch(CATEGORY_URL);
        return await handleResponse(response);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

// ➕ Add a new category
const addCategory = async (newCategory: { name: string; recovery_fee: number }): Promise<Category> => {
    try {
        const response = await fetch(CATEGORY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCategory),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error adding category:", error);
        throw error;
    }
};

// ✏️ Update a category
const updateCategory = async (id: string, updateData: Partial<Category>): Promise<Category> => {
    try {
        const response = await fetch(`${CATEGORY_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

// 🗑 Delete a category
const deleteCategory = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await fetch(`${CATEGORY_URL}/${id}`, { method: "DELETE" });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};

// =============================
// ✅ EXPORT API FUNCTIONS
// =============================
const api = {
    // Lost ID Functions
    fetchLostIDs,
    searchLostIDs,
    uploadLostID,
    updateLostID,
    deleteLostID,
    fetchLostIDById,

    // Category Functions
    fetchIDCategories,
    addCategory,
    updateCategory,
    deleteCategory,
};

export default api;
