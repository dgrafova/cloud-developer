import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'

const AWS = require('aws-sdk')
const uuid = require('uuid')

const dynamoDBClient = new AWS.DynamoDB.DocumentClient()
const grafTodoApp = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Processing incoming event: ', event)

  const todoId = uuid.v4()
  const timestamp = new Date().toISOString()
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const newItem = {
    todoId: todoId,
    createdAt: timestamp,
    userId: getUserId(event),
    ...newTodo
  }

  await dynamoDBClient
    .put({
      TableName: grafTodoApp,
      Item: newItem
    })
    .promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}
