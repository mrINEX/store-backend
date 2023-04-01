export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
};

export type Products = Product[];

export type ProductNotFound = "Product not found";
