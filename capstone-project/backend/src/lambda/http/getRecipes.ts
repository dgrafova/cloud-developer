import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from 'aws-lambda';
import { getUserId } from '../utils';
import { getRecipes } from '../../businessLogic/recipes';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);

  const recipes = await getRecipes(userId);

  const items = recipes.Items;

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      items,
    }),
  };
};
