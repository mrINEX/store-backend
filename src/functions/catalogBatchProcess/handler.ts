import { v4 as uuidv4 } from "uuid";
// import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
// import { Context } from "aws-lambda";
import { SQSEvent, SQSHandler } from "aws-lambda";
import { middyfy } from "../../libs/lambda";
import {
  clientSNSWithoutCredentials as snsClient,
  docClient,
} from "../../libs/ddbClient";
import { getDdbTransactProductService } from "../../libs/productService";
import schema from "../createProduct/schema";
import { ValidateFunction } from "ajv";
import { publish } from "../../libs/importService";

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const STOCKS_TABLE = process.env.STOCKS_TABLE;

const transactService = getDdbTransactProductService(docClient, {
  stock: STOCKS_TABLE,
  product: PRODUCTS_TABLE,
});

const eventSchema = <ValidateFunction>(<unknown>transpileSchema(schema, {
  verbose: true,
  messages: true,
  coerceTypes: false,
}));

export const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
  const { Records } = event;

  const batch = Records.map((record) => {
    const validProductString = eventSchema(record.body);
    const result = JSON.parse(record.body);
    const validProduct = eventSchema(result);
    console.log({ product: result, validProduct, validProductString });

    const { count, ...product } = result;
    const uuid = uuidv4();

    return {
      itemProduct: { ...product, id: uuid },
      itemStock: { count, product_id: uuid },
    };
  });

  await transactService.putBatchTransact(batch);

  await publish(
    snsClient,
    `Products was saved. Length - ${batch.length}. Items - ${JSON.stringify(
      batch.map(({ itemProduct, itemStock }) => ({
        ...itemProduct,
        ...itemStock,
      }))
    )}`
  );
};

export const main = middyfy(catalogBatchProcess, false);

// export const middyValidator = (
//   schema: object
// ): middy.MiddlewareObj<unknown, unknown, Error, Context> => {
// return validator({
//   eventSchema: transpileSchema(schema, {
//     verbose: true,
//     messages: true,
//     coerceTypes: false,
//   }),
// });
// };
