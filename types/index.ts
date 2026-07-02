import { Product, Category, Order, OrderItem, User } from "@prisma/client";

// ============================================
// Product Types
// ============================================

export type ProductWithCategory = Product & {
  category: Category;
};

export type ProductWithDetails = Product & {
  category: Category;
  orderItems: OrderItem[];
};

// ============================================
// Order Types
// ============================================

export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
  user: Pick<User, "id" | "email" | "name">;
};

// ============================================
// Cart Types (Zustand — client side only)
// ============================================

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: "PHYSICAL" | "SERVICE";
}

export interface CartStore {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// ============================================
// Checkout Form Types
// ============================================

export interface CheckoutFormData {
  recipientName: string;
  recipientPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  paymentMethod: "TRANSFER" | "COD";
  notes?: string;
}
