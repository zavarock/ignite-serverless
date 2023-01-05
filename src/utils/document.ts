import {DynamoDB} from "aws-sdk";

export const document = process.env.IS_OFFLINE ? new DynamoDB.DocumentClient({
    region: "localhost",
    endpoint: "http://localhost:8000",
    credentials: {
        accessKeyId: "X",
        secretAccessKey: "X"
    },
}) : new DynamoDB.DocumentClient();