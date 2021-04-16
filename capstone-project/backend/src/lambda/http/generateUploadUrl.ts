import 'source-map-support/register';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from 'aws-lambda';
import { getUserId } from '../utils';
import { generateUploadUrl } from '../../businessLogic/recipes';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const recipeId = event.pathParameters.recipeId;

  const imageUrl = await generateUploadUrl(recipeId, getUserId(event));
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ uploadUrl: imageUrl }),
  };
};
