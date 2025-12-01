import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <div className="container py-5 text-center">
    <div className="form-card d-inline-block">
      <h2 className="mb-2">404 - Page Not Found</h2>
      <p className="mb-4 text-muted">The page you are looking for does not exist.</p>
      <Link className="btn btn-primary" to="/">Go Home</Link>
    </div>
  </div>
);

export default NotFoundPage;
