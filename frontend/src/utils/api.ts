import { Category, Claim, User } from "@/types/types"; // ✅ Use the existing type

const BASE_URL = "/api"; // ✅ Updated base URL to match Next.js API structure

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

// ✅ Reusable API Fetch Helper with Generic Type
const handleResponse = async <T>(response: Response): Promise<T> => {
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

const fetchLostIDs = async (forceRefresh = false): Promise<LostID[]> => {
    const now = Date.now();
    if (!forceRefresh && cachedLostIDs && now - lastLostIDFetch < CACHE_DURATION) {
        console.log("Returning cached Lost IDs...");
        return cachedLostIDs;
    }

    try {
        console.log("Fetching Lost IDs from API...");
        const response = await fetch(LOST_ID_URL);
        const data = await handleResponse<LostID[]>(response);

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
      const response = await fetch(`${LOST_ID_URL}/${id}`);
  
      // Log the response status and body for debugging purposes (in development)
      if (process.env.NODE_ENV === 'development') {
        console.log("API Response Status:", response.status);
        console.log("API Response Status Text:", response.statusText);
  
        // Read the response body text (only once) for logging
        const responseBody = await response.clone().text(); // Clone the response to read the body without consuming the stream
        console.log("API Response Body:", responseBody);
      }
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Error fetching Lost ID: ${response.statusText}`);
      }
  
      // Parse the JSON response
      const data = await response.json();
  
      // Ensure data is of the expected shape, or throw an error if not
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid response structure");
      }
  
      return data as LostID; // Typecast to LostID
    } catch (error) {
      console.error("Error fetching Lost ID by ID:", error);
      throw new Error("Failed to fetch Lost ID details. Please try again later.");
    }
  };
  


// 🔍 Search Lost IDs
const searchLostIDs = async (query: string): Promise<LostID[]> => {
    try {
        const response = await fetch(`${LOST_ID_URL}/search?query=${query}`);
        return await handleResponse<LostID[]>(response);
    } catch (error) {
        console.error("Error searching Lost IDs:", error);
        return [];
    }
};

// 📤 Upload Lost ID
type NewLostID = Omit<LostID, "id">;

const uploadLostID = async (lostIDData: NewLostID): Promise<LostID | { message: string; error: string }> => {
    try {
        const response = await fetch(`${LOST_ID_URL}/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lostIDData),
        });

        const data = await response.json();

        console.log("Server Response:", data);

        if (response.ok) {
            return data.lostId || { message: "Failed to upload Lost ID", error: "Unexpected data format" };
        } else {
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
        return await handleResponse<LostID>(response);
    } catch (error) {
        console.error("Error updating Lost ID:", error);
        throw error;
    }
};

// 🗑 Delete Lost ID
const deleteLostID = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await fetch(`${LOST_ID_URL}/${id}`, { method: "DELETE" });
        return await handleResponse<{ message: string }>(response);
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
        return await handleResponse<Category[]>(response);
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
        return await handleResponse<Category>(response);
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
        return await handleResponse<Category>(response);
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

// 🗑 Delete a category
const deleteCategory = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await fetch(`${CATEGORY_URL}/${id}`, { method: "DELETE" });
        return await handleResponse<{ message: string }>(response);
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};


// =============================
// ✅ USER FUNCTIONS
// =============================

// 🔄 Fetch all users
const fetchUsers = async (): Promise<User[]> => {
    try {
        console.log("Fetching Users...");
        const response = await fetch(`${BASE_URL}/users`);
        return await handleResponse(response);
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

// 🔍 Fetch a user by ID
const fetchUserById = async (id: string): Promise<User> => {
    try {
        const response = await fetch(`${BASE_URL}/users/${id}`);
        return await handleResponse(response);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
};

// ➕ Add a new user
const addUser = async (newUser: { name: string; email: string; phone: string }): Promise<User> => {
    try {
        const response = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
};

// ✏️ Update a user
const updateUser = async (id: string, updateData: Partial<User>): Promise<User> => {
    try {
        const response = await fetch(`${BASE_URL}/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

// 🗑 Delete a user
const deleteUser = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};


// =============================
// ✅ CLAIM FUNCTIONS
// =============================

// 🔄 Fetch all claims
const fetchClaims = async (): Promise<Claim[]> => {
    try {
        console.log("Fetching Claims...");
        const response = await fetch(`${BASE_URL}/claims`);
        return await handleResponse(response);
    } catch (error) {
        console.error("Error fetching claims:", error);
        return [];
    }
};

// 🔍 Fetch claim by ID
const fetchClaimById = async (id: string): Promise<Claim> => {
    try {
        const response = await fetch(`${BASE_URL}/claims/${id}`);
        return await handleResponse(response);
    } catch (error) {
        console.error("Error fetching claim by ID:", error);
        throw error;
    }
};

// ➕ Submit a new claim
const submitClaim = async (claimData: {
    lost_id: string;
    user_id: string;
    category_id: string;
    name: string;
    email: string;
    phone: string;
    comments: string;
    payment_status: string;
    status: string;
}): Promise<Claim> => {
    try {
        const response = await fetch(`${BASE_URL}/claims`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(claimData),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error submitting claim:", error);
        throw error;
    }
};

// ✏️ Update a claim
const updateClaim = async (id: string, updateData: Partial<Claim>): Promise<Claim> => {
    try {
        const response = await fetch(`${BASE_URL}/claims/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error updating claim:", error);
        throw error;
    }
};

// 🗑 Delete a claim
const deleteClaim = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await fetch(`${BASE_URL}/claims/${id}`, { method: "DELETE" });
        return await handleResponse(response);
    } catch (error) {
        console.error("Error deleting claim:", error);
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



    // User Functions
    fetchUsers,
    fetchUserById,
    addUser,
    updateUser,
    deleteUser,

    // Claim Functions
    fetchClaims,
    fetchClaimById,
    submitClaim,
    updateClaim,
    deleteClaim,
};

export default api;
