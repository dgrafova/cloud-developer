import 'source-map-support/register';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';

import { UpdateRecipeRequest } from '../../requests/UpdateRecipeRequest';
import { getUserId } from '../utils';
import { updateRecipe } from '../../businessLogic/recipes';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const recipeId = event.pathParameters.recipeId;
  const userId = getUserId(event);
  const itemToUpdate: UpdateRecipeRequest = JSON.parse(event.body);

  const updatedRecipe = await updateRecipe(itemToUpdate, recipeId, userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ updatedRecipe }),
  };
};
