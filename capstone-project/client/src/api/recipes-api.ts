import { apiEndpoint } from '../config'
import { Recipe } from '../types/Recipe'
import { CreateRecipeRequest } from '../types/CreateRecipeRequest'
import Axios from 'axios'
import { UpdateRecipeRequest } from '../types/UpdateRecipeRequest'

export async function getRecipes(idToken: string): Promise<Recipe[]> {
  console.log('Fetching recipes')

  const response = await Axios.get(`${apiEndpoint}/recipes`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })

  console.log(response.data)
  console.log(response.data.items)
  const items = response.data.items

  return items
}

export async function createRecipe(
  idToken: string,
  newRecipe: CreateRecipeRequest
): Promise<Recipe> {
  console.log('New Recipe: ')
  console.log(newRecipe)
  const response = await Axios.post(`${apiEndpoint}/recipes`, newRecipe, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  return response.data.newItem
}

export async function patchRecipe(
  idToken: string,
  recipeId: string,
  updatedRecipe: UpdateRecipeRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/recipes/${recipeId}`,
    JSON.stringify(updatedRecipe),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deleteRecipe(
  idToken: string,
  recipeId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/recipes/${recipeId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  recipeId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/recipes/${recipeId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
