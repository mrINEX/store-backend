import { middyfy } from "../../libs/lambda";
import { APIGatewayAuthorizerHandler } from "aws-lambda/trigger/api-gateway-authorizer"; // APIGatewayRequestSimpleAuthorizerHandlerV2,

export const basicAuthorizer: APIGatewayAuthorizerHandler = async (event) => {
  // console.log(JSON.stringify(event, null, 2));

  // return { isAuthorized: true };
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

export const main = middyfy(basicAuthorizer, false);
