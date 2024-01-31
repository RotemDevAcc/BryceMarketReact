import React, { useState } from 'react';
import axios from 'axios';
import { TargetServer } from '../settings/settings';
import { Link } from 'react-router-dom';

function PasswordResetRequestForm() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${TargetServer}password_reset/`, { email });
            setMessage(response.data.message);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    return (
        <div className="container-fluid center-form">
            <div className="col-md-6 offset-md-3">
                <h2 className="text-center">Reset Your Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Send Reset Link</button>
                </form>
                <p className="mt-3 text-center">already have an account? <Link to="/login">Login</Link></p>
                {message && <div className="alert alert-success mt-3">{message}</div>}
            </div>
        </div>
    );
}

export default PasswordResetRequestForm;
