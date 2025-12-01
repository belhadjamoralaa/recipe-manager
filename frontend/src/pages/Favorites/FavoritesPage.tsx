import React, { useEffect, useState } from 'react';
import { getFavorites } from '../../api/recipesApi';
import RecipeCard from '../../components/RecipeCard';
import Loader from '../../components/Loader';
import ErrorAlert from '../../components/ErrorAlert';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  author?: { username?: string };
  favoritesCount?: number;
}

const FavoritesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFavorites();
      setRecipes(data.data || []);
    } catch (err) {
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-0">My Favorites</h2>
          <p className="text-muted mb-0">Recipes you’ve saved for quick access.</p>
        </div>
      </div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {loading ? (
        <Loader />
      ) : recipes.length > 0 ? (
        <div className="row g-3">
          {recipes.map((r) => (
            <div className="col-md-6 col-lg-4" key={r._id}>
              <RecipeCard recipe={r} />
            </div>
          ))}
        </div>
      ) : (
        <div className="list-empty text-center">
          <p className="mb-2">No favorites yet.</p>
          <p className="text-muted mb-3">Browse recipes and add the ones you love.</p>
          <a className="btn btn-primary" href="/recipes">Browse Recipes</a>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
