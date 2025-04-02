export interface LostID {
    id: string;
    id_number: string;
    owner_name: string;
    category_id?: string; 
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
  