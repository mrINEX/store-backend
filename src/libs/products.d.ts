export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
};

export type ProductResponse = {
  data: Product;
  message: "product";
};

export type Products = Product[];

export type ProductsResponse = {
  data: Products;
  message: "products";
};

export type ProductNotFound = "Product not found";
