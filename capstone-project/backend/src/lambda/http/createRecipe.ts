import 'source-map-support/register';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';

import { CreateRecipeRequest } from '../../requests/CreateRecipeRequest';
import { getUserId } from '../utils';
import { createRecipe } from '../../businessLogic/recipes';
import { createLogger } from '../../utils/logger';
const logger = createLogger('createRecipe');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newRecipe: CreateRecipeRequest = JSON.parse(event.body);
  const newItem = await createRecipe(newRecipe, getUserId(event));

  logger.info('New Item:', newItem);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      newItem,
    }),
  };
};
