import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import isEmpty from 'validator/lib/isEmpty'
import { useForm } from "react-hook-form";
import { AuthContext } from '../context/AuthContext'
import userAPI from '../API/user';


function Login(props) {
    const { addLocal, jwt, user } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationMsg, setValidationMsg] = useState('');
    const { handleSubmit } = useForm();

    const validateAll = () => {
        let msg = {}
        if (isEmpty(email)) {
            msg.email = "Email không được để trống"
        }
        if (isEmpty(password)) {
            msg.password = "Password không được để trống"
        }
        setValidationMsg(msg)
        if (Object.keys(msg).length > 0) return false;
        return true;
    }

    const handleLogin = () => {
        const isValid = validateAll();
        if (!isValid) return
        login();
    }

    const login = async () => {
        const user = {
            email: email,
            password: password
        }
        const response = await userAPI.login(user)
        console.log(response);

        if (response.msg === "Đăng nhập thành công") {
            addLocal(response.jwt, response.user)
            props.history.push('/')

        } else
            setValidationMsg({ api: response.msg })
    }

    return (
        <div>
            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li className="active">Login</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="page-section mb-60">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-xs-12 col-lg-6 mb-30 mr_signin">
                            <form onSubmit={handleSubmit(handleLogin)}>
                                <div className="login-form">
                                    <h4 className="login-title">Login</h4>
                                    <p className="form-text text-danger">{validationMsg.api}</p>
                                    <div className="row">

                                        <div className="col-md-12 col-12 mb-20">
                                            <label htmlFor="username">Username</label>
                                            <input id="username" className="mb-0" type="text" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            <p className="form-text text-danger">{validationMsg.email}</p>
                                        </div>
                                        <div className="col-12 mb-20">
                                            <label htmlFor="password">Password</label>
                                            <input id="password" className="mb-0" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <p className="form-text text-danger">{validationMsg.password}</p>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="check-box d-inline-block ml-0 ml-md-2 mt-10">
                                                <Link to="/register">Do You Account?</Link>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mt-10 mb-20 text-left text-md-right">
                                            <Link to="/forget">Forget Password</Link>
                                        </div>
                                        <div className="col-md-12">
                                            <button className="register-button mt-0" style={{ cursor: 'pointer' }}>Login</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;