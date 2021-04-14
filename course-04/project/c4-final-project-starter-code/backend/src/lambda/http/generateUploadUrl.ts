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
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const imageUrl = getUploadUrl(todoId)

  console.log('imageURL: ', imageUrl)

  let response: APIGatewayProxyResult = {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ uploadUrl: imageUrl })
  }

  await dynamoDBClient
    .update(
      {
        TableName: grafTodoApp,
        Key: { userId, todoId },
        UpdateExpression: 'set attachmentUrl=:attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
        },
        ReturnValues: 'UPDATED_NEW'
      },
      function (err, data) {
        if (err) {
          const error = JSON.stringify(err, null, 2)
          console.error(
            'Error while saving the imageURL to the DynamoDB:',
            error
          )
          response.statusCode = 400
          response.body = `'error' ${error}`
        } else {
          const updatedItem = JSON.stringify(data, null, 2)
          console.log('ImageUrl updated successfully:', updatedItem)
        }
      }
    )
    .promise()

  return response
}

function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: parseInt(urlExpiration)
  })
}
