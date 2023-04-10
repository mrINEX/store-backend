import {
  DynamoDBClient,
  TransactWriteItemsCommand,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import axios from "axios";
import { marshall } from "@aws-sdk/util-dynamodb";

export interface Product extends Stock {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
}

export interface Stock {
  product_id: string;
  count: number;
}

let productService: ProductService | undefined;

/**
 * singleton
 */
export function getProductService() {
  if (productService == null) {
    productService = new ProductService();
  }
  return productService;
}

/**
 * product
 */
export function getDdbProductService(
  client: DynamoDBDocumentClient,
  table: string
) {
  return new DdbProductService(client, table);
}

/**
 * stock
 */
export function getDdbStockService(
  client: DynamoDBDocumentClient,
  table: string
) {
  return new DdbStockService(client, table);
}

export function getDdbTransactProductService(
  client: DynamoDBDocumentClient,
  tableNames: {
    stock: string;
    product: string;
  }
) {
  return new DdbTransactProductService(client, {
    stock: tableNames.stock,
    product: tableNames.product,
  });
}

class DdbStockService {
  constructor(private client: DynamoDBClient, private table: string) {}

  public async getStock(id: string): Promise<Stock> {
    const product = await this.client.send(
      new GetCommand({
        TableName: this.table,
        Key: {
          pk: this.table,
          sk: id,
        },
      })
    );
    return product.Item as Stock;
  }

  public async getStocks(): Promise<Stock[]> {
    const products = await this.client.send(
      new QueryCommand({
        TableName: this.table,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": this.table },
      })
    );

    return products.Items as Stock[];
  }

  public async putStock(item: Stock) {
    const params = {
      TableName: this.table,
      Item: {
        pk: this.table,
        sk: item.product_id,
        ...item,
      },
    };

    const data = await this.client.send(new PutCommand(params));
    console.log("Success - stock added or updated", data);
  }
}

class DdbProductService {
  constructor(private client: DynamoDBClient, private table: string) {}

  public merge(products: Product[], stocks: Stock[]) {
    for (const product of products) {
      const stock = stocks.find((stock) => stock.product_id === product.id);
      product.count = stock.count;
    }
  }

  public async getProduct(id: string): Promise<Product> {
    const product = await this.client.send(
      new GetCommand({
        TableName: this.table,
        Key: {
          pk: this.table,
          sk: id,
        },
      })
    );
    return product.Item as Product;
  }

  public async getProducts(): Promise<Product[]> {
    const products = await this.client.send(
      new QueryCommand({
        TableName: this.table,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": this.table },
      })
    );

    return products.Items as Product[];
  }

  public async putProduct(item: Omit<Product, "count" | "product_id">) {
    const image = await this.getImage(item.title);

    const params = {
      TableName: this.table,
      Item: {
        pk: this.table,
        sk: item.id,
        image,
        ...item,
      },
    };
    const data = await this.client.send(new PutCommand(params));
    console.log("Success - product added or updated", data);
  }

  public async getImage(title: string) {
    const client_id =
      "87e26779aa6242a2b2fc8e863886185d1d1f07215e4890071e45448baedf8950";
    const res = await axios.get(
      `https://api.unsplash.com/search/photos/?client_id=${client_id}&query=${title}&per_page=1`
    );

    return res.data.results[0].urls.small;
  }
}

type TransactItems = {
  itemStock: Stock;
  itemProduct: Omit<Product, "count" | "product_id">;
};

class DdbTransactProductService {
  constructor(
    private client: DynamoDBClient,
    private tableNames: { stock: string; product: string }
  ) {}

  private createStockParams(item: Stock) {
    return {
      TableName: this.tableNames.stock,
      Item: marshall({
        pk: this.tableNames.stock,
        sk: item.product_id,
        ...item,
      }),
    };
  }

  private async createProductParams(
    item: Omit<Product, "count" | "product_id">
  ) {
    const image = await this.getImage(item.title);

    return {
      TableName: this.tableNames.product,
      Item: marshall({
        pk: this.tableNames.product,
        sk: item.id,
        image,
        ...item,
      }),
    };
  }

  async putTransact({ itemStock, itemProduct }: TransactItems) {
    const stockParams = this.createStockParams(itemStock);
    const productParams = await this.createProductParams(itemProduct);

    const input = {
      TransactItems: [{ Put: stockParams }, { Put: productParams }],
    };

    const command = new TransactWriteItemsCommand(input);
    const response = await this.client.send(command);
    console.log(
      `Success - transact for ${this.tableNames.stock} and ${this.tableNames.product}`,
      response
    );
    return response;
  }

  public async getImage(title: string) {
    const client_id =
      "87e26779aa6242a2b2fc8e863886185d1d1f07215e4890071e45448baedf8950";
    const res = await axios.get(
      `https://api.unsplash.com/search/photos/?client_id=${client_id}&query=cats,${title}&per_page=1`
    );

    return res.data.results[0].urls.small;
  }
}

class ProductService {
  private mock: Promise<Omit<Product, "count" | "product_id">[]>;
  public async getProducts(): Promise<Omit<Product, "count" | "product_id">[]> {
    if (this.mock == null) {
      this.mock = Promise.all(
        [
          { cat: "Ragdoll", id: "7eadbebe-0900-4b10-afde-d2a303bcfbd9" },
          {
            cat: "Exotic Shorthair",
            id: "0301dd99-39a2-4781-81e3-77e6162827b2",
          },
          {
            cat: "British Shorthair",
            id: "f6915b02-321a-47aa-b712-76580f9e27bb",
          },
          { cat: "Maine Coon", id: "f3fbcae8-4dce-4c68-bda0-103a92adc4a3" },
          { cat: "Devon Rex", id: "e0ff5437-a160-47b7-af7a-ba8b300b6625" },
          { cat: "Sphynx", id: "bf2144c7-6762-4889-839a-6b1e2cf3d823" },
          { cat: "Scottish Fold", id: "84b32bc9-ff22-49de-b94d-c02eb5a9829f" },
          { cat: "Abyssinian", id: "0134c71c-3931-4e38-8aae-219bd2156da7" },
          { cat: "Siamese", id: "e211c2c1-f305-4705-ad5d-ef87527b03d0" },
          { cat: "Cornish Rex", id: "88f6353b-3df9-4ab7-bec4-aa9708a1f4e1" },
          { cat: "Russian Blue", id: "f5a3565a-6806-4da8-acd6-15aa467a7f9d" },
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

  public getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
}
