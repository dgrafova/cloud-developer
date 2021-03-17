import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const AWS = require('aws-sdk');

const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
const grafTodoApp = process.env.TODO_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
 
  console.log('Processing incoming event: ', event);

  const result = await dynamoDBClient.scan({
    TableName: grafTodoApp,
  }).promise();

  const items = result.Items;

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      items: items
    })
  }
}
