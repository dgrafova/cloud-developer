const AWSXRay = require('aws-xray-sdk');
import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { RecipeItem } from '../models/RecipeItem';
import { UpdateRecipeRequest } from '../requests/UpdateRecipeRequest';
import { createLogger } from '../utils/logger';
const logger = createLogger('dynamoAccess');

const XAWS = AWSXRay.captureAWS(AWS);

export class RecipesAccess {
  constructor(
    private readonly dynamoDBClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly grafRecipeApp = process.env.RECIPE_TABLE,
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly userIdIndex = process.env.USER_INDEX,
    private readonly s3 = new AWS.S3({
      signatureVersion: 'v4',
    })
  ) {}

  async getRecipes(userId: string) {
    const recipes = await this.dynamoDBClient
      .query({
        TableName: this.grafRecipeApp,
        IndexName: this.userIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
      .promise();

    logger.info('UserIdIndex: ', this.userIdIndex);
    logger.info('UserId: ', userId);
    logger.info('Rezepte: ', recipes);

    return recipes;
  }

  async createRecipe(newRecipe: RecipeItem): Promise<RecipeItem> {
    await this.dynamoDBClient
      .put({
        TableName: this.grafRecipeApp,
        Item: newRecipe,
      })
      .promise();

    return newRecipe;
  }

  async updateRecipe(
    itemToUpdate: UpdateRecipeRequest,
    recipeId: string,
    userId: string
  ) {
    logger.info('Updating a recipe...');

    const updatedRecipe = await this.dynamoDBClient
      .update(
        {
          TableName: this.grafRecipeApp,
          Key: { userId, recipeId },
          ExpressionAttributeNames: { '#N': 'name' },
          UpdateExpression:
            'set #N=:recipeName, description=:description, favourite=:favourite',
          ExpressionAttributeValues: {
            ':recipeName': itemToUpdate.name,
            ':description': itemToUpdate.description,
            ':favourite': itemToUpdate.favourite,
          },
          ReturnValues: 'UPDATED_NEW',
        },
        function (err, data) {
          if (err) {
            const error = JSON.stringify(err, null, 2);
            logger.error('Unable to update item. Error JSON:', error);
          } else {
            const updatedItem = JSON.stringify(data, null, 2);
            logger.info('Successfully updated recipe:', updatedItem);
          }
        }
      )
      .promise();

    return updatedRecipe;
  }

  async deleteRecipe(recipeId: string, userId: string) {
    await this.dynamoDBClient
      .delete(
        {
          TableName: this.grafRecipeApp,
          Key: { userId, recipeId },
        },
        function (err, data) {
          if (err) {
            const error = JSON.stringify(err, null, 2);
            logger.error('Unable to delete the recipe. Error JSON:', error);
          } else {
            const updatedItem = JSON.stringify(data, null, 2);
            logger.info('Successfully deleted:', updatedItem);
          }
        }
      )
      .promise();
  }

  async generateUploadUrl(recipeId: string, userId: string) {
    const imageUrl = this.getUploadUrl(recipeId);

    await this.dynamoDBClient
      .update(
        {
          TableName: this.grafRecipeApp,
          Key: { userId, recipeId },
          UpdateExpression: 'set attachmentUrl=:attachmentUrl',
          ExpressionAttributeValues: {
            ':attachmentUrl': `https://${this.bucketName}.s3.amazonaws.com/${recipeId}`,
          },
          ReturnValues: 'UPDATED_NEW',
        },
        function (err, data) {
          if (err) {
            const error = JSON.stringify(err, null, 2);
            logger.error(
              'Error while saving the imageURL to the DynamoDB:',
              error
            );
          } else {
            const updatedItem = JSON.stringify(data, null, 2);
            logger.info('ImageUrl updated successfully:', updatedItem);
          }
        }
      )
      .promise();

    return imageUrl;
  }

  getUploadUrl(recipeId: string) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: recipeId,
      Expires: parseInt(this.urlExpiration),
    });
  }
}
