import { useEffect, useState } from 'react'
import { is_user_logged } from './loginSlice';
import { Link, useNavigate } from 'react-router-dom';
import { registerAsync, register_status, reset_status } from './registerSlice';
import { Message } from '../../Message';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faIdCard, faUserCircle, faCalendarAlt, faVenusMars, faLock } from '@fortawesome/free-solid-svg-icons';



const Register = () => {

    const dispatch = useAppDispatch();
    const logged = useAppSelector(is_user_logged);
    const status = useAppSelector(register_status)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        dob: '2000-01-01',
        gender: '',
        password: '',
        confirm_password: '',
    });

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            firstname: '',
            lastname: '',
            dob: '2000-01-01',
            gender: '',
            password: '',
            confirm_password: '',
        });
    };

    
    useEffect(() => {
        return () => {
            resetForm();
            dispatch(reset_status())
        };
    }, [dispatch])
    

    useEffect(() => {
        if (logged || status === "move") {
            navigate("/login")
        }
    }, [navigate, logged, status])


    const RegisterAccount = () => {

        const uservalue = formData.username
        const fnamevalue = formData.firstname
        const lnamevalue = formData.lastname
        const emailvalue = formData.email
        const passvalue = formData.password
        const confirm_password = formData.confirm_password
        const gender = formData.gender
        const date = formData.dob
        if (!uservalue) {
            Message("Username was not entered", "error")
            return
        }
        if (!fnamevalue || !lnamevalue) {
            Message("Firstname or Lastname weren't entered", "error")
            return
        }

        if (!emailvalue) {
            Message("Email was not entered", "error")
            return
        }

        if (!passvalue) {
            Message("Password was not entered", "error")
            return
        }

        if (!confirm_password) {
            Message("Confirm Password was not entered", "error")
            return
        }

        if (passvalue !== confirm_password) {
            Message("Passwords are not equal", "error")
            return
        }


        if (!gender || gender === "") {
            Message("Gender was not entered", "error")
            return
        }

        if (!date) {
            Message("Date was not entered", "error")
            return
        }
        dispatch(registerAsync(formData))
    }

    return (
        <div>
            {status !== "move" ? (
                <div className="container center-form">
                    <div className="col-md-6 offset-md-3">
                        <h1 className="text-center">Register</h1>

                        <div className="form-group">
                            <label htmlFor="username">
                                <FontAwesomeIcon icon={faUser} /> Username:
                            </label>
                            <input type="text" className="form-control" name="username" placeholder="karen123" onChange={handleInputChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                <FontAwesomeIcon icon={faEnvelope} /> Email Address:
                            </label>
                            <input type="email" className="form-control" name="email" placeholder="example@gmail.com" onChange={handleInputChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="firstname">
                                <FontAwesomeIcon icon={faIdCard} /> Firstname:
                            </label>
                            <input type="text" className="form-control" name="firstname" placeholder="avner" onChange={handleInputChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastname">
                                <FontAwesomeIcon icon={faUserCircle} /> Lastname:
                            </label>
                            <input type="text" className="form-control" name="lastname" placeholder="yeruham" onChange={handleInputChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dob">
                                <FontAwesomeIcon icon={faCalendarAlt} /> Birthdate:
                            </label>
                            <input type="date" className="form-control" name="dob" required onChange={handleInputChange} value="2000-01-01" min="1948-01-01" max="2024-12-31" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">
                                <FontAwesomeIcon icon={faVenusMars} /> Gender:
                            </label>
                            <select defaultValue={''} name="gender" required onChange={handleInputChange}>
                                <option value='' disabled>Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <FontAwesomeIcon icon={faLock} /> Password:
                            </label>
                            <input type="password" className="form-control" name="password" onChange={handleInputChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_password">
                                <FontAwesomeIcon icon={faLock} /> Confirm Password
                            </label>
                            <input type="password" className="form-control" name="confirm_password" onChange={handleInputChange} required />
                        </div>

                        {status === '' ?
                            <button type="submit" onClick={() => RegisterAccount()} className="btn btn-primary btn-block">Register</button>
                            :
                            <button type="submit" onClick={() => status === "rejected" ? dispatch(reset_status()) : Message("Register underway, Please Wait", "error")} className='btn btn-warning btn-block'>{status}</button>
                        }
                        <p className="mt-3 text-center">already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </div>
            ) : <></>}
        </div>
    );

}

export default Register