import { Item, SharedWith, List } from "@/lib/schemas";

// Re-export the main types
export type { Item as CartItem, SharedWith, List as Cart };

// Additional cart-specific types if needed
export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  itemCount: number;
}

export interface CartFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// Optimistic state types
export interface OptimisticItem {
  _id?: string;
  name: string;
  amount: string | number ;
  price?: number;
  desc?: string;
  img?: string;
  isOptimistic?: boolean;
  isDeleting?: boolean;
}

export interface OptimisticCart {
  _id: string;
  title: string;
  creatorId: string;
  items: OptimisticItem[];
  sharedWith: SharedWith[];
}

export type CartAction = 
  | {
      type: 'ADD_ITEM';
      payload: {
        item: Omit<OptimisticItem, '_id'>;
        tempId: string;
      };
    }
  | {
      type: 'DELETE_ITEM';
      payload: {
        itemId: string;
      };
    }
  | {
      type: 'CONFIRM_ADD_ITEM';
      payload: {
        tempId: string;
        actualId: string;
      };
    }
  | {
      type: 'CONFIRM_DELETE_ITEM';
      payload: {
        itemId: string;
      };
    }
  | {
      type: 'REVERT_ADD_ITEM';
      payload: {
        tempId: string;
      };
    }
  | {
      type: 'REVERT_DELETE_ITEM';
      payload: {
        itemId: string;
      };
    };

export interface CartContextType {
  cart: OptimisticCart;
  addItemOptimistic: (item: Omit<OptimisticItem, '_id'>) => Promise<void>;
  deleteItemOptimistic: (itemId: string) => Promise<void>;
  isLoading: boolean;
} 