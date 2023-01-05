import {APIGatewayProxyHandler} from "aws-lambda";

import {document} from "../utils/document";

interface ITodoRequest {
    title: string;
    deadline: string;
}

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

    const {title, deadline} = JSON.parse(event.body) as ITodoRequest;

    const updatedItem = {
        ...findTodo.Item,
        title,
        deadline: new Date(deadline).getTime(),
    };

    await document.put({
        TableName: 'todos',
        Item: updatedItem
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify(updatedItem)
    }
};