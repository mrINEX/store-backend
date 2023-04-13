import { ValidatedEventAPIGatewayProxyEvent } from "../../libs/api-gateway";
import { formatJSONResponse } from "../../libs/api-gateway";
import { clientS3WithoutCredentials as client } from "../../libs/ddbClient";
import { generatePutSignedUrl } from "../../libs/importService";
import { middyfy } from "../../libs/lambda";

export const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  undefined
> = async (event) => {
  const { name } = event.queryStringParameters;

  const signedUrl = await generatePutSignedUrl(name, client);

  return formatJSONResponse({
    data: { signedUrl },
    message: "signed url",
  });
};

export const main = middyfy(importProductsFile);
