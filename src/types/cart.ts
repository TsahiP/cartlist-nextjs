export interface CartItem {
  name: string;
  amount: string;
  price: number;
  desc: string;
  img: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SharedWith {
  email: string;
  permission: string;
  fullName: string;
  lastName: string;
  firstName: string;
}

export interface Cart {
  _id: string;
  title: string;
  amount: number;
  creatorId: string;
  items: CartItem[];
  sharedWith: SharedWith[];
  results?: CartItem[];
} 