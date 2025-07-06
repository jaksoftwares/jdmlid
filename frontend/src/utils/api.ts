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
    category_id: string;
    id_categories: {
      name: string;
      recovery_fee: number;
  };
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

export const fetchLostIDs = async (): Promise<LostID[]> => {
  const now = Date.now();
  if (cachedLostIDs && now - lastLostIDFetch < CACHE_DURATION) {
    console.log("Returning cached Lost IDs...");
    return cachedLostIDs;
  }

  try {
    console.log("Fetching Lost IDs from API...");
    const response = await fetch(LOST_ID_URL);
    const data = await handleResponse<LostID[]>(response);

    cachedLostIDs = data;
    lastLostIDFetch = now;

    return data;
  } catch (error) {
    console.error("Error fetching Lost IDs:", error);
    throw new Error("Failed to fetch Lost IDs.");
  }
};

// 🔍 Search Lost IDs (reusing fetchLostIDs with query param)
export const searchLostIDs = async (query: string): Promise<LostID[]> => {
  try {
    const url = new URL(LOST_ID_URL, window.location.origin);
    url.searchParams.set("query", query);

    const response = await fetch(url.toString());
    return await handleResponse<LostID[]>(response);
  } catch (error) {
    console.error("Error searching Lost IDs:", error);
    return [];
  }
};

// 📄 Fetch Lost ID by ID
export const fetchLostIDById = async (id: string): Promise<LostID> => {
  try {
    const response = await fetch(`${LOST_ID_URL}/${id}`);
    return await handleResponse<LostID>(response);
  } catch (error) {
    console.error("Error fetching Lost ID by ID:", error);
    throw new Error("Failed to fetch Lost ID details.");
  }
};

// 📤 Upload Lost ID
export type NewLostID = Omit<LostID, "id" | "id_categories">;

export const uploadLostID = async (
  lostIDData: NewLostID
): Promise<LostID> => {
  try {
    const response = await fetch(LOST_ID_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lostIDData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Failed to upload Lost ID");
    }

    return data.lostId;
  } catch (error) {
    console.error("Error uploading Lost ID:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

// ✏️ Update Lost ID
export const updateLostID = async (
  id: string,
  updateData: Partial<LostID>
): Promise<LostID> => {
  try {
    const response = await fetch(`${LOST_ID_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Failed to update Lost ID");
    }

    if (!data || typeof data !== "object" || !data.id) {
      throw new Error("Invalid response from server: Expected LostID object");
    }

    return data as LostID;
  } catch (error) {
    console.error("Error updating Lost ID:", error);
    throw error;
  }
};


// 🗑 Delete Lost ID
export const deleteLostID = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${LOST_ID_URL}/${id}`, {
      method: "DELETE",
    });

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

// Fetch category by ID
const fetchCategoryById = async (categoryId: string): Promise<Category> => {
    try {
        const response = await fetch(`${CATEGORY_URL}/${categoryId}`);
        if (!response.ok) {
            throw new Error("Category not found");
        }
        return await handleResponse<Category>(response); // Assuming handleResponse handles JSON parsing and error handling
    } catch (error) {
        console.error("Error fetching category by ID:", error);
        throw error; // Re-throw the error to be caught in the component
    }
}

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


export const checkAuthSession = async () => {
    const response = await fetch('/api/auth');  // API route to check session
    if (!response.ok) {
      throw new Error('Session check failed');
    }
    return await response.json();  // This will return the session data, or an error
  };

// =============================
// ✅ CLAIM FUNCTIONS
// =============================

// 🔄 Fetch all claims
export const fetchClaims = async (status?: string): Promise<Claim[]> => {
    try {
        console.log("Fetching Claims...");
        const url = status ? `${BASE_URL}/claims?status=${status}` : `${BASE_URL}/claims`;
        const response = await fetch(url);
        return await handleResponse(response);
    } catch (error) {
        console.error("Error fetching claims:", error);
        return [];
    }
};

// 🔍 Fetch claim by ID
export const fetchClaimById = async (id: string): Promise<Claim | null> => {
    try {
        const response = await fetch(`${BASE_URL}/claims/${id}`);
        if (response.status === 404) {
            return null; // Return null if claim is not found
        }
        return await handleResponse(response);
    } catch (error) {
        console.error("Error fetching claim by ID:", error);
        throw error; // Rethrow error to handle it upstream
    }
};

// API call to initiate payment (start the MPESA STK push)
export const initiatePayment = async (phone: string, amount: number, lost_id: string, user_id: string) => {
    try {
        // Log the request data for debugging
        console.log("Initiating payment with data:", { phone, amount, lost_id, user_id });

        // Call the API endpoint to initiate the MPESA payment
        const response = await fetch('/api/payments/initiate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, amount, lost_id, user_id }),
        });

        // Log the response status and body for debugging
        console.log("API response status:", response.status);
        const data = await response.json();
        console.log("API response body:", data);

        // Check if the response status indicates success
        if (!response.ok) {
            const errorMessage = data.error || 'Failed to initiate payment';
            console.error("Error response:", errorMessage);
            throw new Error(errorMessage);
        }

        // Log the successful response and return the CheckoutRequestID
        console.log("Payment initiated successfully. CheckoutRequestID:", data.CheckoutRequestID);
        return data; // Return the successful response (CheckoutRequestID)
    } catch (error: unknown) {
        // Enhanced logging for the error that occurred
        console.error("Error initiating payment:", error);

        // Check if it's an instance of Error to log a message
        if (error instanceof Error) {
            console.error("Error message:", error.message);
        } else {
            console.error("Unknown error occurred during payment initiation");
        }

        // Throw the error with a clear message to the calling function
        throw new Error(error instanceof Error ? error.message : 'Something went wrong while initiating payment');
    }
};

export const checkPaymentStatus = async (lost_id: string) => {
    const res = await fetch(`/api/payments/status?lost_id=${lost_id}`);
    if (!res.ok) throw new Error('Failed to fetch payment status');
    return res.json();
  };

  
  // API call to handle MPESA callback and update the payment status
  export const handleMpesaCallback = async (paymentData: unknown) => {
    try {
      // Call the callback endpoint to handle MPESA response
      const response = await fetch('/api/payments/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
  
      const data = await response.json();
  
      // Check if the callback processing was successful
      if (!response.ok) {
        const errorMessage = data.error || 'Failed to process payment callback';
        console.error("Error response from callback:", errorMessage);
        throw new Error(errorMessage);
      }
  
      // Return the processed data (success message or updated status)
      return data;
    } catch (error: unknown) {
      console.error('Error processing callback:', error);
      throw new Error(error instanceof Error ? error.message : 'Something went wrong while processing the callback');
    }
  };
  
  // API call to submit a claim after confirming payment (Renamed to avoid conflict)
  export const submitPaymentClaim = async (user_id: string, lost_id: string, payment_id: string) => {
    try {
      // Call the API endpoint to submit a claim after payment confirmation
      const response = await fetch('/api/claims/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, lost_id, payment_id }),
      });
  
      const data = await response.json();
  
      // Check if the claim submission was successful
      if (!response.ok) {
        const errorMessage = data.error || 'Failed to submit claim';
        console.error("Error response from claim submission:", errorMessage);
        throw new Error(errorMessage);
      }
  
      // Return the success message or data related to the claim submission
      return data;
    } catch (error: unknown) {
      console.error('Error submitting claim:', error);
      throw new Error(error instanceof Error ? error.message : 'Something went wrong while submitting the claim');
    }
  };
  
// ➕ Submit a new claim (Renamed to avoid conflict with the payment-related claim)
export const submitClaim = async (claimData: {
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
    } catch (error: unknown) {
        console.error("Error submitting claim:", error);
        throw new Error(error instanceof Error ? error.message : 'Failed to submit claim');
    }
};

// ✏️ Update a claim
export const updateClaim = async (id: string, updateData: Partial<Claim>): Promise<Claim> => {
    try {
        const response = await fetch(`${BASE_URL}/claims/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        });
        return await handleResponse(response);
    } catch (error: unknown) {
        console.error("Error updating claim:", error);
        throw new Error(error instanceof Error ? error.message : 'Failed to update claim');
    }
};

// 🗑 Delete a claim
export const deleteClaim = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await fetch(`${BASE_URL}/claims/${id}`, { method: "DELETE" });
        if (response.status === 404) {
            throw new Error("Claim not found");
        }
        return await handleResponse(response);
    } catch (error: unknown) {
        console.error("Error deleting claim:", error);
        throw new Error(error instanceof Error ? error.message : 'Failed to delete claim');
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
    fetchCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,



    // User Functions
    fetchUsers,
    fetchUserById,
    addUser,
    updateUser,
    deleteUser,
    checkAuthSession,

    // Claim Functions
    fetchClaims,
    fetchClaimById,
    submitClaim,
    updateClaim,
    deleteClaim,

    //payment
    initiatePayment,
    checkPaymentStatus,
    
};

export default api;
