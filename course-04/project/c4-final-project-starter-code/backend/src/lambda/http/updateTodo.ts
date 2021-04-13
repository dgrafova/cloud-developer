import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context } from 'aws-lambda'

//import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
//import { getUserId } from '../utils'

//const AWS = require('aws-sdk');


// const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
// const grafTodoApp = process.env.TODO_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context ): Promise<APIGatewayProxyResult> => {
  //const todoId = event.pathParameters.todoId
  //const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  console.log("Update event: ", event);
  console.log("Context: ", context);
  // { name: 'test', dueDate: '2019-07-27T20:01:45.424Z', done: true }
  /*const userId = getUserId(event);

  const updatedItem = {
    todoId: todoId,
    createdAt: timestamp,
    userId: getUserId(event),
    ...newTodo
  }

  await dynamoDBClient.update({
    TableName: grafTodoApp,
    Item: newItem
  }).promise()
*/
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
    })
  }
}