import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { TargetServer } from '../settings/settings';
import { useNavigate } from 'react-router-dom'
import { Message } from '../../Message';

function PasswordResetForm() {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { userId, token } = useParams();
    const [PasswordReseted, setPasswordReseted] = useState(false)

    const navigate = useNavigate()
    const goback = () => {
        navigate("/")
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(PasswordReseted) return Message("Password reset already used, Wait for redirection.","error")
        try {
            const response = await axios.post(`${TargetServer}password_reset_confirm/`, {
                userId,
                token,
                newPassword
            });
            setMessage(response.data.message);
            if(response.data.success){
                Message("Password Reset Successful, redirecting you now.","info")
                setPasswordReseted(true)
                setTimeout(() => {
                    setPasswordReseted(false)
                    goback()
                }, 1000);
            }

            console.log(response)
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className="container-fluid center-form">
            {userId !== "" && token !== "" ? <div className="col-md-6 offset-md-3">
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
            </div> : <section className="container mt-4">
                <h2>Password Reset</h2>
                <p>if you see this an unknown problem has occured with resetting your password</p>
                <button className='button btn-primary' style={{ borderRadius: "20px" }} onClick={() => goback()}>Click Here To Go Back</button>
            </section>}

        </div>
    );
}

export default PasswordResetForm;
