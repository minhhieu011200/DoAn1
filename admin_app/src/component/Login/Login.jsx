import React, { useState, useContext, useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import isEmpty from 'validator/lib/isEmpty'
import cookie from 'react-cookies'
import { useForm } from "react-hook-form";

import userAPI from '../Api/userAPI';
import { AuthContext } from '../context/Auth'

function Login(props) {
    const { addLocal, jwt, user } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationMsg, setValidationMsg] = useState('');
    const [redirect, setRedirect] = useState(true)
    const { handleSubmit } = useForm();
    let history = useHistory();

    const validateAll = () => {
        let msg = {}
        if (isEmpty(email)) {
            msg.email = "Email không được để trống"
        }
        if (isEmpty(password)) {
            msg.password = "Email không được để trống"
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

        if (response.msg === "Đăng nhập thành công") {
            if (response.user.id_permission.permission === "Nhân Viên") {
                setRedirect(false)
                addLocal(response.jwt, response.user)

                history.push('/customer')


            }
            else if (response.user.id_permission.permission === "Admin") {
                setRedirect(false)
                addLocal(response.jwt, response.user)
                history.push('/user')
            } else {
                setValidationMsg({ api: "Bạn không có quyền truy cập" })
            }

        } else
            setValidationMsg({ api: response.msg })
    }

    return (
        <div className="auth-wrapper d-flex no-block justify-content-center align-items-center position-relative" style={{ background: 'url(../assets/images/big/auth-bg.jpg) no-repeat center center' }}>
            <div className="auth-box row">
                <div className="col-lg-7 col-md-5 modal-bg-img" style={{ backgroundImage: 'url(../assets/images/big/3.jpg)' }}>
                </div>
                <div className="col-lg-5 col-md-7 bg-white">
                    <div className="p-3">
                        <div className="text-center">
                            <img src="../assets/images/big/icon.png" alt="wrapkit" />
                        </div>
                        <h2 className="mt-3 text-center">Sign In</h2>

                        {
                            <p className="form-text text-danger">{validationMsg.api}</p>
                        }
                        <form className="mt-4" onSubmit={handleSubmit(handleLogin)}>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="text-dark" htmlFor="uname">Email</label>
                                        <input className="form-control" name="email" type="text" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <p className="form-text text-danger">{validationMsg.email}</p>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="text-dark" htmlFor="pwd">Password</label>
                                        <input className="form-control" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                                        <p className="form-text text-danger">{validationMsg.password}</p>
                                    </div>
                                </div>
                                <div className="col-lg-12 text-center">
                                    <button type="submit" className="btn btn-block btn-dark">Sign In</button>
                                </div>
                                {
                                    redirect && cookie.load('jwt') && cookie.load('user') && cookie.load('user').id_permission.permission === "Nhân Viên" && <Redirect to="/customer" />
                                }
                                {
                                    redirect && cookie.load('jwt') && cookie.load('user') && cookie.load('user').id_permission.permission === "Admin" && <Redirect to="/user" />
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;