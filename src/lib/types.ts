// ======================== items actions ========================
// Align ItemFormData with itemSchema so that Zod resolver types match
export interface ItemFormData {
  name: string;
  amount?: number | string;
  price?: number;
  desc?: string;
  img?: string;
  _id?: string;
}
  
  //========================= user actions =================
  export interface UserFormData {
    username: string;
    password: string;
  }
  // ======================== user actions ========================
  export interface UserFormData {
    username: string;
    password: string;
    rePassword: string;
    img?: string;
    email?: string;
  }

  // ======================== ai actions ========================
  export interface CartItem {
    id: string
    name: string
    quantity: number
  }

// Re-export types from schemas for backward compatibility
export type {
  User,
  LoginData,
  RegisterData,
  Item,
  SharedWith,
  List,
  CreateListData,
  ShareListData,
  ChangePermissionData,
} from "./schemas";

// Additional utility types
export interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  data?: T;
  status?: "success" | "error";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}