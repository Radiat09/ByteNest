export interface Product {
  _id: string;
  title: string;
  price: number;
  discountedPrice?: number | null;
  imageUrl: string[];
  category: string;
  sellCount: number;
  mostPopular?: boolean;
}

export interface Category {
  _id: string;
  title: string;
  imageUrl?: string;
}

export interface FlashSaleProduct {
  _id: string;
  title: string;
  price: number;
  discountedPrice?: number | null;
  imageUrl: string[];
  category: string;
  sellCount: number;
  mostPopular?: boolean;
}

export interface FlashSale {
  _id: string;
  title: string;
  discountPercent: number;
  products: FlashSaleProduct[];
  startTime: string;
  endTime: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
