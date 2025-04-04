export interface LostID {
    id: string;
    id_number: string;
    owner_name: string;
    category_id?: string; 
    category?: string;
    location_found: string;
    date_found: string;
    status: string;
    contact_info: string;
    comments: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    created_at: string;
    recovery_fee: number;
  }
  

  export interface ClaimData {
    id: string;
    lost_id: string;
    user_id: string;
    category_id: string;
    name: string;
    email: string;
    phone: string;
    comments: string;
    payment_status: string;
    status: string;
    created_at: string; // Consider using Date if you want to handle date objects
  }
  // =============================
// ✅ USER TYPE
// =============================
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

// =============================
// ✅ CLAIM TYPE
// =============================
export interface Claim {
  id: string;
  lost_id: string;
  user_id: string;
  category_id: string;
  name: string;
  email: string;
  phone: string;
  comments: string;
  payment_status: string;
  status: string;
  created_at: string;
  updated_at: string;
}


export interface IDetails  {
  owner_name: string;
  category: string;
  location_found: string;
};

export interface ClaimFormData  {
  lost_id: string;
  category_id: string;
  name: string;
  email: string;
  phone: string;
  comments: string;
};