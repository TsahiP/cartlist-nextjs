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