import client from './client';

export async function getRecipes(params: { page?: number; limit?: number; q?: string } = {}) {
  const res = await client.get('/recipes', { params });
  return res.data;
}

export async function getRecipeById(id: string) {
  const res = await client.get(`/recipes/${id}`);
  return res.data;
}

export async function createRecipe(payload: {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  imageUrl?: string;
}) {
  const res = await client.post('/recipes', payload);
  return res.data;
}

export async function updateRecipe(
  id: string,
  payload: Partial<{
    title: string;
    description: string;
    ingredients: string[];
    instructions: string;
    imageUrl?: string;
  }>
) {
  const res = await client.put(`/recipes/${id}`, payload);
  return res.data;
}

export async function deleteRecipe(id: string) {
  const res = await client.delete(`/recipes/${id}`);
  return res.data;
}

export async function getComments(recipeId: string) {
  const res = await client.get(`/recipes/${recipeId}/comments`);
  return res.data;
}

export async function addComment(recipeId: string, content: string) {
  const res = await client.post(`/recipes/${recipeId}/comments`, { content });
  return res.data;
}

export async function deleteComment(recipeId: string, commentId: string) {
  const res = await client.delete(`/recipes/${recipeId}/comments/${commentId}`);
  return res.data;
}

export async function addFavorite(recipeId: string) {
  const res = await client.post(`/favorites/${recipeId}`);
  return res.data;
}

export async function removeFavorite(recipeId: string) {
  const res = await client.delete(`/favorites/${recipeId}`);
  return res.data;
}

export async function getFavorites(params: { page?: number; limit?: number } = {}) {
  const res = await client.get('/favorites', { params });
  return res.data;
}
