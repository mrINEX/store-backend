// export const ProductSchema = Yup.object({
//   id: Yup.string(),
//   title: Yup.string().required().default(""),
//   description: Yup.string().default(""),
//   price: Yup.number().positive().required().defined().default(0),
// });

import axios from "axios";

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
};

const cats = [
  "Ragdoll",
  "Exotic Shorthair",
  "British Shorthair",
  "Maine Coon",
  "Devon Rex",
  "Sphynx",
  "Scottish Fold",
  "Abyssinian",
  "Siamese",
  "Cornish Rex",
  "Russian Blue",
];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export const mockProducts: Promise<Product[]> = Promise.all(
  cats.map(async (cat, i) => {
    return {
      title: cat,
      description: `description ${i}`,
      id: `${i}-id`,
      price: getRandomInt(1, 50),
    };
  })
);

// export const mockProducts: Product[] = [
//   {
//     description: "Short Product Description1",
//     id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
//     price: 24,
//     title: "ProductOne",
//   },
//   {
//     description: "Short Product Description7",
//     id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
//     price: 15,
//     title: "ProductTitle",
//   },
//   {
//     description: "Short Product Description2",
//     id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
//     price: 23,
//     title: "Product",
//   },
//   {
//     description: "Short Product Description4",
//     id: "7567ec4b-b10c-48c5-9345-fc73348a80a1",
//     price: 15,
//     title: "ProductTest",
//   },
//   {
//     description: "Short Product Description1",
//     id: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
//     price: 23,
//     title: "Product2",
//   },
//   {
//     description: "Short Product Description7",
//     id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
//     price: 15,
//     title: "ProductName",
//   },
// ];
