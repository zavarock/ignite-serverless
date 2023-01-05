import {APIGatewayProxyHandler} from "aws-lambda";

import {document} from "../utils/document";

export const handler: APIGatewayProxyHandler = async (event) => {
    const {userId} = event.pathParameters;

    const findUser = await document.get({
        TableName: 'users',
        Key: {
            id: userId
        }
    }).promise();

    if (!findUser.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: 'User ID not found'
            })
        }
    }

    const todos = await document.query({
        TableName: 'todos',
        IndexName: 'userIdIndex',
        KeyConditionExpression: 'user_id = :user_id',
        ExpressionAttributeValues: {
            ':user_id': userId
        }
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(todos.Items)
    }
};