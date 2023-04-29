import { middyfy } from "../../libs/lambda";
import { APIGatewayRequestAuthorizerHandler } from "aws-lambda/trigger/api-gateway-authorizer";

export const basicAuthorizer: APIGatewayRequestAuthorizerHandler = async (
  event
) => {
  const { Authorization } = event.headers;

  const utf8Password = Buffer.from(
    Authorization.replace("Basic ", ""),
    "base64"
  ).toString("utf8");
  const [user, password] = utf8Password.split(":");
  const isValid = process.env.mrinex === password;

  console.log({
    mrinex: process.env.mrinex,
    utf8Password,
    password,
    user,
    isValid,
  });

  return {
    principalId: "user",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: isValid ? "Allow" : "Deny",
          Resource: event.methodArn,
        },
      ],
    },
  };
};

// Buffer.from("TEST_PASSWORD").toString("base64");
// ("VEVTVF9QQVNTV09SRA==");

// Buffer.from("VEVTVF9QQVNTV09SRA==", "base64").toString("utf8");
// ("TEST_PASSWORD");

export const main = middyfy(basicAuthorizer, false);
