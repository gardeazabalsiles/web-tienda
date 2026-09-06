export type ProductStatus = "Nuevo" | "Usado";

export interface Product {
  id: number;
  sellerId: string;
  sellerName: string;
  name: string;
  category: "Hombre" | "Mujer" | "Niños" | "Accesorios";
  price: number;
  status: ProductStatus;
  sizes: string[];
  description: string;
  images: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}
