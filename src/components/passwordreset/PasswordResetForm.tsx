import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PasswordResetForm() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { userId, token } = useParams();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/password_reset_confirm/', {
        userId,
        token,
        newPassword
      });
      setMessage(response.data.message);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="container-fluid center-form">
      <div className="col-md-6 offset-md-3">
        <h1 className="text-center">Reset Your Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input 
              type="password" 
              className="form-control" 
              id="newPassword" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Reset Password</button>
        </form>
        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}

export default PasswordResetForm;
