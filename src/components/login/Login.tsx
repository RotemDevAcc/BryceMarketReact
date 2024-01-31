import React, { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { get_login_status, is_user_logged, loginAsync, reset_loginstatus } from './loginSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Message } from '../../Message';


const Login = () => {

  const dispatch = useAppDispatch();
  const [userName, setusername] = useState("")
  const [password, setpassword] = useState("")
  const status = useAppSelector(get_login_status);
  const logged = useAppSelector(is_user_logged);
  const navigate = useNavigate()

  const login_user = async () => {
    const details = { userName: userName, password: password };

    try {

      if(!details.userName && !details.password){
        Message("You Have To Type a username and a password.","error")
        return
      }

      dispatch(loginAsync(details));
    } catch (error) {
      // Handle any errors
      console.error('Login error:', error);
    }
  }

  useEffect(() => {
    // Use useEffect to navigate after the component has been rendered
    if (logged) {
      navigate('/');
    }

    
    return () =>{
      dispatch(reset_loginstatus())
    }
  }, [logged, navigate, dispatch]);

  const buttontypes:any = {
    "pending":"warning",
    "done":"success",
    "rejected":"danger"
  }

  return (
    <div>
      {!logged ? (
        <div className="container-fluid center-form">
          <div className="col-md-6 offset-md-3">
            <h1 className="text-center">Login</h1>

            <div className="form-group">
              <label htmlFor="username">
              <FontAwesomeIcon icon={faUser} /> Username:
              </label>
              <input type="text" onChange={(e) => setusername(e.target.value)} className="form-control" id="username" name="username" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} /> Password:
                
                </label>
              <input type="password" onChange={(e) => setpassword(e.target.value)} className="form-control" id="password" name="password" required />
            </div>

            <button type="submit" onClick={() => login_user()} className={`btn btn-${buttontypes[status] || "primary"} btn-block`}>Login {status}</button>
            <p className="mt-3 text-center">
              Don't have an account? <Link to="/register">Create New Account</Link>
            </p>
            <p className="mt-3 text-center">
              <Link to="/passwordreset">Forgot My Password</Link>
            </p>
          </div>
        </div>
      ) : <></>}
    </div>
  );

}

export default Login