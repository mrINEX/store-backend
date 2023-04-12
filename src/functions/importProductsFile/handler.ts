import { ValidatedEventAPIGatewayProxyEvent } from "../../libs/api-gateway";
import { formatJSONResponse } from "../../libs/api-gateway";
import { clientS3WithoutCredentials } from "../../libs/ddbClient";
import { generateSignedUrl } from "../../libs/importService";
import { middyfy } from "../../libs/lambda";

export const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  undefined
> = async (event) => {
  const signedUrl = await generateSignedUrl(
    event.queryStringParameters.name,
    clientS3WithoutCredentials
  );

  return formatJSONResponse({
    data: { signedUrl },
    message: "signed url",
  });
};

export const main = middyfy(importProductsFile);
