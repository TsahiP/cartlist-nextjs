// ======================== items actions ========================
export interface ItemFormData {
    name: string;
    amount: number;
    price: number;
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