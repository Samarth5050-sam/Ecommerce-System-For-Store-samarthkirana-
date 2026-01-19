export interface Product {
  id: string;
  name: string;
  nameHindi?: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  inStock: boolean;
  discount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  nameHindi?: string;
  icon: string;
  color: string;
}

export interface StoreInfo {
  name: string;
  owner: string;
  contact: string;
  address: string;
  tagline: string;
}
