import 'source-map-support/register';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from 'aws-lambda';
import { getUserId } from '../utils';
import { deleteRecipe } from '../../businessLogic/recipes';
import { createLogger } from '../../utils/logger';
const logger = createLogger('deleteRecipe');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const recipeId = event.pathParameters.recipeId;
  const userId = getUserId(event);

  logger.info('Deleting the recipe with an id ', recipeId);

  await deleteRecipe(recipeId, userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: '',
  };
};
