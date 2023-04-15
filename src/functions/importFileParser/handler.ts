import { S3Handler } from "aws-lambda";
import { middyfy } from "../../libs/lambda";

export const importFileParser: S3Handler = async (event) => {
  const [Record] = event.Records;

  console.log(Record);
};

export const main = middyfy(importFileParser, false);
