import React from 'react';

interface Props {
  message: string;
  onClose?: () => void;
}

const ErrorAlert: React.FC<Props> = ({ message, onClose }) => (
  <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
    <span>{message}</span>
    {onClose && (
      <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
    )}
  </div>
);

export default ErrorAlert;
