import type { Product } from "./marketplace";

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  items: Array<{ product: Product; size: string; quantity: number }>;
  total: number;
  payment: "efectivo" | "qr";
  status: "Pendiente" | "Confirmado";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userIds: string[];
  userNames: string[];
  productId?: number;
  productName?: string;
  orderId?: string;
  updatedAt: string;
}
