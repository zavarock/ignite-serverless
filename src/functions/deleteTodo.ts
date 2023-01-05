import {APIGatewayProxyHandler} from "aws-lambda";

import {document} from "../utils/document";

export const handler: APIGatewayProxyHandler = async (event) => {
    const {id} = event.pathParameters;

    const findTodo = await document.get({
        TableName: 'todos',
        Key: {
            id
        }
    }).promise();

    if (!findTodo.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: 'Todo ID not found!'
            })
        }
    }

    await document.delete({
        TableName: 'todos',
        Key: {
            id
        }
    }).promise();

    return {
        statusCode: 200,
        body: null
    }
};