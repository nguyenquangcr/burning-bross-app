export interface Product {
  id: number;
  brand: string;
  category: string;
  title: string;
  description: string;
  discountPercentage: number;
  images: string[];
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
}

export interface ListProduct {
  limit: number; 
  products: Product[]; 
  skip:number; 
  total: number
}