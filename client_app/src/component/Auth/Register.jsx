import React, { useState } from 'react';
import isEmpty from 'validator/lib/isEmpty'
import isEmail from 'validator/lib/isEmail'
import { useForm } from "react-hook-form";
import userAPI from '../API/user';
import { Link } from 'react-router-dom';
import queryString from 'query-string'

function Register(props) {
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [validationMsg, setValidationMsg] = useState('');
    const { handleSubmit } = useForm();

    const validateAll = () => {
        let msg = {}
        const nameRegex = /^\b[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ ]+.{1}$/
        const usernameRegex = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
        if (isEmpty(email)) {
            msg.email = "Email không được để trống"
        } else if (!isEmail(email)) {
            msg.email = "Email sai định dạng"
        }
        if (isEmpty(fullname)) {
            msg.fullname = "Name không được để trống"
        } else if (nameRegex.test(fullname.trim()) === false) {
            msg.fullname = "Name sai định dạng (Ít nhất 3 kí tự alphabet)"
        }
        if (isEmpty(username)) {
            msg.username = "Username không được để trống"
        } else if (!usernameRegex.test(username.trim())) {
            msg.username = "Username sai định dạng"
        }
        if (isEmpty(password)) {
            msg.password = "Password không được để trống"
        }
        if (password !== confirm) {
            msg.confirm = "Xác nhận mật khẩu không đúng"
        }
        setValidationMsg(msg)
        if (Object.keys(msg).length > 0) return false;
        return true;
    }

    const handleRegister = () => {
        const isValid = validateAll();
        if (!isValid) return
        register();
    }

    const register = async () => {
        const user = {
            name: fullname,
            username: username,
            email: email,
            password: password
        }
        const query = '?' + queryString.stringify(user)
        const response = await userAPI.create(query)
        console.log(response)
        if (response.msg === "Bạn đã thêm thành công") {
            props.history.push('/login')

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
                            <li className="active">Register</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="page-section mb-60">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-6 col-xs-12 mr_signin">
                            <form onSubmit={handleSubmit(handleRegister)}>
                                <div className="login-form">
                                    <h4 className="login-title">Register</h4>
                                    <p className="form-text text-danger">{validationMsg.api}</p>
                                    <div className="row">
                                        <div className="col-md-12 mb-5">
                                            <label for="name">FullName</label>
                                            <input className="mb-0" id="name" type="text" placeholder="First Name" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                                            <p className="form-text text-danger">{validationMsg.fullname}</p>
                                        </div>
                                        <div className="col-md-12 mb-5">
                                            <label for="email">Email</label>
                                            <input className="mb-0" id="email" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            <p className="form-text text-danger">{validationMsg.email}</p>
                                        </div>
                                        <div className="col-md-12 mb-5">
                                            <label for="username">Username</label>
                                            <input className="mb-0" type="text" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                            <p className="form-text text-danger">{validationMsg.username}</p>
                                        </div>
                                        <div className="col-md-6 mb-5">
                                            <label for="password">Password</label>
                                            <input className="mb-0" type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <p className="form-text text-danger">{validationMsg.password}</p>
                                        </div>
                                        <div className="col-md-6 mb-5">
                                            <label for="confirm">Confirm Password</label>
                                            <input className="mb-0" type="password" id="confirm" placeholder="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                                            <p className="form-text text-danger">{validationMsg.confirm}</p>
                                        </div>
                                        <div className="col-md-12 mb-5">
                                            <div className="d-flex justify-content-end">
                                                <Link to="/login">Do You Want To Login?</Link>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="register-button mt-0" style={{ cursor: 'pointer' }}>Register</button>
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

export default Register;