import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  getRecipeById,
  deleteRecipe,
  addFavorite,
  removeFavorite,
  getComments,
  addComment,
  deleteComment,
  getFavorites,
} from '../../api/recipesApi';
import Loader from '../../components/Loader';
import ErrorAlert from '../../components/ErrorAlert';
import { useAuth } from '../../context/AuthContext';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  author?: { _id: string; username?: string; email?: string };
  favoritesCount?: number;
}

interface Comment {
  _id: string;
  content: string;
  author?: { username?: string; _id?: string; avatarUrl?: string };
  createdAt: string;
}

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  const fetchRecipe = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getRecipeById(id);
      setRecipe(data.data);
    } catch (err) {
      setError('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!id) return;
    try {
      const data = await getComments(id);
      setComments(data.data);
      setCommentsError(null);
    } catch (err) {
      setCommentsError('Failed to load comments');
    }
  };

  const fetchFavoriteStatus = async () => {
    if (!id || !isAuthenticated) return;
    try {
      const data = await getFavorites({ limit: 100 });
      const exists = (data.data || []).some((r: any) => r._id === id);
      setIsFavorited(exists);
    } catch (err) {
      // ignore favorite status errors silently
    }
  };

  useEffect(() => {
    fetchRecipe();
    fetchComments();
    fetchFavoriteStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated]);

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await deleteRecipe(id);
      navigate('/recipes');
    } catch (err) {
      setError('Failed to delete recipe');
    }
  };

  const handleFavoriteToggle = async () => {
    if (!id) return;
    setFavoriteLoading(true);
    try {
      if (isFavorited) {
        await removeFavorite(id);
        setIsFavorited(false);
      } else {
        await addFavorite(id);
        setIsFavorited(true);
      }
      fetchRecipe();
    } catch (err) {
      setError('Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentInput.trim()) return;
    try {
      await addComment(id, commentInput.trim());
      setCommentInput('');
      fetchComments();
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!id) return;
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(id, commentId);
      fetchComments();
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="container"><ErrorAlert message={error} /></div>;
  if (!recipe) return <div className="container"><p>Recipe not found</p></div>;

  const isAuthor = user && recipe.author && recipe.author._id === user.id;

  return (
    <div className="container py-3">
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card card-hover border-0 mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <div className="badge bg-light text-dark mb-2">Recipe</div>
                  <h2 className="mb-1">{recipe.title}</h2>
                  <p className="text-muted mb-2">By {recipe.author?.username || 'Unknown'}</p>
                </div>
                {isAuthor && (
                  <div className="d-flex gap-2">
                    <Link className="btn btn-sm btn-outline-primary" to={`/recipes/${recipe._id}/edit`}>
                      Edit
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <p className="lead">{recipe.description}</p>
              <div className="mb-3">
                <div className="section-title">
                  <span className="dot"></span>
                  <h5 className="mb-0">Ingredients</h5>
                </div>
                <ul className="list-unstyled mb-0">
                  {recipe.ingredients?.map((ing, idx) => (
                    <li key={idx} className="mb-1">• {ing}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="section-title">
                  <span className="dot"></span>
                  <h5 className="mb-0">Instructions</h5>
                </div>
                <p className="mb-0">{recipe.instructions}</p>
              </div>
            </div>
          </div>
          <div className="card border-0 card-hover">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Comments</h4>
                <span className="text-muted small">{comments.length} comment(s)</span>
              </div>
              {commentsError && <ErrorAlert message={commentsError} onClose={() => setCommentsError(null)} />}
              {comments.length === 0 && <p className="text-muted">No comments yet.</p>}
              <div className="d-grid gap-2 mb-3">
                {comments.map((c) => {
                  const canDelete = user && (c.author?._id === user.id || isAuthor);
                  return (
                    <div key={c._id} className="comment-card d-flex justify-content-between align-items-start">
                      <div>
                        <strong>{c.author?.username || 'Anonymous'}</strong>
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                          {new Date(c.createdAt).toLocaleString()}
                        </div>
                        <div>{c.content}</div>
                      </div>
                      {canDelete && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteComment(c._id)}>
                          Delete
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              {isAuthenticated && (
                <form onSubmit={handleAddComment} className="d-grid gap-2">
                  <div>
                    <label className="form-label">Add a comment</label>
                    <textarea
                      className="form-control"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <button className="btn btn-primary" type="submit">Submit</button>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 card-hover mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">At a glance</h5>
                <span className="badge bg-light text-dark">Favorites {recipe.favoritesCount || 0}</span>
              </div>
              {isAuthenticated && (
                <button className="btn btn-primary w-100 btn-heart" onClick={handleFavoriteToggle} disabled={favoriteLoading}>
                  {favoriteLoading ? 'Updating...' : isFavorited ? '♥ In favorites' : '♡ Add to favorites'}
                </button>
              )}
              {!isAuthenticated && <p className="text-muted mt-2 mb-0">Login to save this recipe.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
