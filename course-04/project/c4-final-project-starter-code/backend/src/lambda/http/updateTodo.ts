import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

const AWS = require('aws-sdk');


const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
const grafTodoApp = process.env.TODO_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);
  const itemToUpdate: UpdateTodoRequest = JSON.parse(event.body)
  console.log("Updating a todo...");

  let response: APIGatewayProxyResult = {
    statusCode: 201,
    headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
    },
    body: ''
  };

  await dynamoDBClient.update({
    TableName: grafTodoApp,
    Key: { userId, todoId },
    ExpressionAttributeNames: { "#N": "name" },
    UpdateExpression: "set #N=:todoName, dueDate=:dueDate, done=:done",
    ExpressionAttributeValues: {
      ":todoName": itemToUpdate.name,
      ":dueDate": itemToUpdate.dueDate,
      ":done": itemToUpdate.done
    },
    ReturnValues: "UPDATED_NEW"
}, function(err, data){
  if (err) {
    const error = JSON.stringify(err, null, 2);
    console.error("Unable to update item. Error JSON:", error);
    response.statusCode = 400;
    response.body = `'error' ${error}`;
  } else {
    const updatedItem = JSON.stringify(data, null, 2);
    console.log("UpdateItem succeeded:", updatedItem);
    response.body = `'updatedItem' ${updatedItem}`;
  }
})
.promise();

return response;
}