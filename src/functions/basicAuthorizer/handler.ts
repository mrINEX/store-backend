import { middyfy } from "../../libs/lambda";
import { APIGatewayRequestAuthorizerHandler } from "aws-lambda/trigger/api-gateway-authorizer";
import { Unauthorized, Forbidden } from "http-errors";

export const basicAuthorizer: APIGatewayRequestAuthorizerHandler = async (
  event,
  _context,
  cb
) => {
  const { Authorization } = event.headers;
  if (!Authorization) {
    cb(Unauthorized());
  }

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

  if (!isValid) {
    cb(Forbidden());
  }

  return {
    principalId: "user",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
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
