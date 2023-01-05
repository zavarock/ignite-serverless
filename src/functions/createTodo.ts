import {APIGatewayProxyHandler} from "aws-lambda";
import {v4 as uuidv4} from "uuid";

import {document} from "../utils/document";

interface IUserRequest {
    title: string;
    deadline: string;
}

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

    const {title, deadline} = JSON.parse(event.body) as IUserRequest;
    const newTodoId = uuidv4();
    const newTodo = {
        id: newTodoId,
        user_id: userId,
        title,
        done: false,
        deadline: new Date(deadline).getTime(),
        created_at: new Date().getTime()
    };

    await document.put({
        TableName: 'todos',
        Item: newTodo
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(newTodo)
    }
};