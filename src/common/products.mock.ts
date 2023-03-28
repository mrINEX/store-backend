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

const client_id =
  "87e26779aa6242a2b2fc8e863886185d1d1f07215e4890071e45448baedf8950";

export const mockProducts: Promise<Product[]> = Promise.all(
  cats.map(async (cat, i) => {
    const res = await axios.get(
      `https://api.unsplash.com/search/photos/?client_id=${client_id}&query=${cat}`
    );
    console.log(res);
    return {
      title: cat,
      description: `description ${i}`,
      id: `${i}-id`,
      price: getRandomInt(1, 50),
      image: res.data.results[0].urls.small,
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
