import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createRecipe, getRecipeById, updateRecipe } from '../../api/recipesApi';
import Loader from '../../components/Loader';
import ErrorAlert from '../../components/ErrorAlert';

const RecipeFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getRecipeById(id);
        const r = data.data;
        setTitle(r.title || '');
        setDescription(r.description || '');
        setIngredients((r.ingredients || []).join(', '));
        setInstructions(r.instructions || '');
        setImageUrl(r.imageUrl || '');
      } catch (err) {
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };
    loadRecipe();
  }, [id]);

  const validateInputs = () => {
    if (title.trim().length < 3) return 'Title must be at least 3 characters';
    if (description.trim().length < 5) return 'Description must be at least 5 characters';
    if (instructions.trim().length < 5) return 'Instructions must be at least 5 characters';
    const ingArray = ingredients
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (ingArray.length === 0) return 'Please add at least one ingredient';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        description,
        instructions,
        ingredients: ingredients
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        imageUrl: imageUrl || undefined,
      };
      if (isEdit && id) {
        await updateRecipe(id, payload);
        navigate(`/recipes/${id}`);
      } else {
        const res = await createRecipe(payload);
        navigate(`/recipes/${res.data._id}`);
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to save recipe';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) return <Loader />;

  return (
    <div className="container" style={{ maxWidth: 820 }}>
      <div className="form-card">
        <h2 className="mb-3">{isEdit ? 'Edit Recipe' : 'New Recipe'}</h2>
        <p className="text-muted mb-4">
          Share your favorite dish with the community. Add clear instructions and ingredients.
        </p>
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        <form onSubmit={handleSubmit} className="d-grid gap-3">
          <div className="row g-3">
            <div className="col-lg-6">
              <label className="form-label">Title</label>
              <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="col-lg-6">
              <label className="form-label">Image URL (optional)</label>
              <input className="form-control" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label">Ingredients (comma separated)</label>
            <input
              className="form-control"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Instructions</label>
            <textarea
              className="form-control"
              rows={5}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecipeFormPage;
