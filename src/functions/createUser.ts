import {APIGatewayProxyHandler} from "aws-lambda";
import {v4 as uuidv4} from "uuid";

import {document} from "../utils/document";

interface IUserRequest {
    name: string;
    username: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const {name, username} = JSON.parse(event.body) as IUserRequest;

    const findUsername = await document.query({
        TableName: 'users',
        IndexName: 'usernameIndex',
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': username
        }
    }).promise();

    if (findUsername.Count) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Username already in use!'
            })
        }
    }

    const newUserId = uuidv4();
    const newUser = {
        id: newUserId,
        name,
        username,
        created_at: new Date().getTime()
    };

    await document.put({
        TableName: 'users',
        Item: newUser
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(newUser)
    }
};