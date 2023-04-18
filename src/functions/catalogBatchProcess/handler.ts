import { ValidatedEventAPIGatewayProxyEvent } from "../../libs/api-gateway";
import { formatJSONResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";

export const catalogBatchProcess: ValidatedEventAPIGatewayProxyEvent<
  undefined
> = async () => {
  // const { name } = event.queryStringParameters;
  console.log("sqs", process.env.SQS);

  const sqs = await Promise.resolve({ sqs: "sqs" });

  return formatJSONResponse({
    data: sqs,
    message: "sqs",
  });
};

export const main = middyfy(catalogBatchProcess);
