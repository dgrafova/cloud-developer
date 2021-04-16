export interface RecipeItem {
  userId: string;
  recipeId: string;
  name: string;
  description: string;
  favourite: boolean;
  attachmentUrl?: string;
}
