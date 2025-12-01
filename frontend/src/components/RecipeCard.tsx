import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  recipe: {
    _id: string;
    title: string;
    description: string;
    author?: { username?: string };
    favoritesCount?: number;
    imageUrl?: string;
  };
}

const RecipeCard: React.FC<Props> = ({ recipe }) => {
  return (
    <div className="card card-hover h-100 border-0">
      {recipe.imageUrl ? (
        <img src={recipe.imageUrl} className="card-img-top" alt={recipe.title} style={{ height: 160, objectFit: 'cover' }} />
      ) : (
        <div className="placeholder-tile"></div>
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-2">{recipe.title}</h5>
        <p className="card-text text-muted text-clamp-2">{recipe.description}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <small className="text-muted">
            By {recipe.author?.username || 'Unknown'} • ♥ {recipe.favoritesCount || 0}
          </small>
          <Link className="btn btn-sm btn-primary" to={`/recipes/${recipe._id}`}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
