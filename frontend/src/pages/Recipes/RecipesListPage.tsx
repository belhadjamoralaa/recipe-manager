import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getRecipes } from '../../api/recipesApi';
import RecipeCard from '../../components/RecipeCard';
import Loader from '../../components/Loader';
import ErrorAlert from '../../components/ErrorAlert';
import { useAuth } from '../../context/AuthContext';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  author?: { username?: string };
  favoritesCount?: number;
}

const RecipesListPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1, pageSize: 10 });
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const page = Number(searchParams.get('page') || 1);
  const q = searchParams.get('q') || '';

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecipes({ page, limit: 5, q });
      setRecipes(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input[name="q"]') as HTMLInputElement;
    setSearchParams({ q: input.value, page: '1' });
  };

  const goToPage = (p: number) => {
    setSearchParams({ q, page: String(p) });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Recipes</h2>
        {isAuthenticated && (
          <Link className="btn btn-success" to="/recipes/new">
            + New Recipe
          </Link>
        )}
      </div>

      <form className="mb-3" onSubmit={handleSearch}>
        <div className="input-group">
          <input
            type="text"
            name="q"
            className="form-control"
            placeholder="Search recipes"
            defaultValue={q}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
      </form>

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
          <p className="mb-2">No recipes found.</p>
          {isAuthenticated && (
            <Link className="btn btn-success" to="/recipes/new">
              Create your first recipe
            </Link>
          )}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button className="btn btn-outline-secondary" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          className="btn btn-outline-secondary"
          disabled={page >= pagination.totalPages}
          onClick={() => goToPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RecipesListPage;
