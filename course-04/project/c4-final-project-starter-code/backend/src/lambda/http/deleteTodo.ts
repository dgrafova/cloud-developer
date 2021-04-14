import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import { getUserId } from '../utils'

const AWS = require('aws-sdk')

const dynamoDBClient = new AWS.DynamoDB.DocumentClient()
const grafTodoApp = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  console.log('Deleting the todo with an id ', todoId)

  let response: APIGatewayProxyResult = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }

  await dynamoDBClient
    .delete(
      {
        TableName: grafTodoApp,
        Key: { userId, todoId }
      },
      function (err, data) {
        if (err) {
          const error = JSON.stringify(err, null, 2)
          console.error('Unable to delete the todo. Error JSON:', error)
          response.statusCode = 400
          response.body = `'error' ${error}`
        } else {
          const updatedItem = JSON.stringify(data, null, 2)
          console.log('Successfully deleted:', updatedItem)
        }
      }
    )
    .promise()

  return response
}
