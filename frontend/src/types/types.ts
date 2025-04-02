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
  