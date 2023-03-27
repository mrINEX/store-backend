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
};

const cats = [
  "Ragdoll",
  "Exotic Shorthair",
  "British Shorthair",
  "Persian",
  "Maine Coon",
  "American Shorthair",
  "Devon Rex",
  "Sphynx",
  "Scottish Fold",
  "Abyssinian",
  "Oriental",
  "Siamese",
  "Cornish Rex",
  "Bengal",
  "Russian Blue",
  "Siberian",
];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export const mockProducts: Product[] = cats.map((cat, i) => ({
  title: cat,
  description: `description ${i}`,
  id: `${i}-id`,
  price: getRandomInt(1, 50),
}));
