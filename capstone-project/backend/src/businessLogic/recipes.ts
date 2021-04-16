import { RecipesAccess } from '../dataLayer/recipesAccess';
import { CreateRecipeRequest } from '../requests/CreateRecipeRequest';
import { UpdateRecipeRequest } from '../requests/UpdateRecipeRequest';
const uuid = require('uuid');

const recipesAccess = new RecipesAccess();

export async function getRecipes(userId: string) {
  return recipesAccess.getRecipes(userId);
}

export async function createRecipe(
  newRecipe: CreateRecipeRequest,
  userId: string
) {
  const recipeId = uuid.v4();

  const newItem = {
    recipeId: recipeId,
    userId: userId,
    favourite: false,
    ...newRecipe,
  };

  return recipesAccess.createRecipe(newItem);
}

export async function updateRecipe(
  itemToUpdate: UpdateRecipeRequest,
  recipeId: string,
  userId: string
) {
  return recipesAccess.updateRecipe(itemToUpdate, recipeId, userId);
}

export async function deleteRecipe(recipeId: string, userId: string) {
  return recipesAccess.deleteRecipe(recipeId, userId);
}

export async function generateUploadUrl(recipeId: string, userId: string) {
  return recipesAccess.generateUploadUrl(recipeId, userId);
}
