import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <div className="container"><p>User not found.</p></div>;

  return (
    <div className="container py-3" style={{ maxWidth: 720 }}>
      <div className="form-card">
        <h2 className="mb-2">Profile</h2>
        <p className="text-muted mb-4">Your account details</p>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="p-3 bg-light rounded">
              <div className="text-muted small">Username</div>
              <div className="fw-semibold">{user.username}</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 bg-light rounded">
              <div className="text-muted small">Email</div>
              <div className="fw-semibold">{user.email}</div>
            </div>
          </div>
          {user.createdAt && (
            <div className="col-md-6">
              <div className="p-3 bg-light rounded">
                <div className="text-muted small">Joined</div>
                <div className="fw-semibold">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
