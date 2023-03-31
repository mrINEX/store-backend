import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// export const ProductSchema = Yup.object({
//   id: Yup.string(),
//   title: Yup.string().required().default(""),
//   description: Yup.string().default(""),
//   price: Yup.number().positive().required().defined().default(0),
// });

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
};

let productService: ProductService | undefined;

/**
 * Singleton
 *
 * @returns ProductService
 */
export function getProductService() {
  if (productService == null) {
    productService = new ProductService();
  }
  return productService;
}

class ProductService {
  private mock: Promise<Product[]>;
  public async getProducts(): Promise<Product[]> {
    if (this.mock == null) {
      this.mock = Promise.all(
        [
          { cat: "Ragdoll", id: uuidv4() },
          { cat: "Exotic Shorthair", id: uuidv4() },
          { cat: "British Shorthair", id: uuidv4() },
          { cat: "Maine Coon", id: uuidv4() },
          { cat: "Devon Rex", id: uuidv4() },
          { cat: "Sphynx", id: uuidv4() },
          { cat: "Scottish Fold", id: uuidv4() },
          { cat: "Abyssinian", id: uuidv4() },
          { cat: "Siamese", id: uuidv4() },
          { cat: "Cornish Rex", id: uuidv4() },
          { cat: "Russian Blue", id: uuidv4() },
        ].map(async ({ cat, id: uuid }) => {
          const client_id =
            "87e26779aa6242a2b2fc8e863886185d1d1f07215e4890071e45448baedf8950";
          const res = await axios.get(
            `https://api.unsplash.com/search/photos/?client_id=${client_id}&query=${cat}&per_page=1`
          );

          return {
            title: cat,
            description: res.data.results[0].description,
            id: uuid,
            price: this.getRandomInt(1, 50),
            image: res.data.results[0].urls.small,
          };
        })
      );
    }
    return this.mock;
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
}
