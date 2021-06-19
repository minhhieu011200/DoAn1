import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import userAPI from '../API/user';
import queryString from 'query-string'
import isEmpty from 'validator/lib/isEmpty'
import { AuthContext } from '../context/AuthContext'


function Profile(props) {
    const { user, changeProfile } = useContext(AuthContext);
    const [validationMsg, setValidationMsg] = useState('');
    const [name, set_name] = useState('')
    const [username, set_username] = useState('')
    const [email, set_email] = useState('')
    const [password, set_password] = useState('')
    const [new_password, set_new_password] = useState('')
    const [compare_password, set_compare_password] = useState('')
    const [message, setMessage] = useState('')
    const [message1, setMessage1] = useState('')
    const [edit_status, set_edit_status] = useState('edit_profile')


    const handler_Status = (value) => {

        set_edit_status(value)

    }
    if (!user) {
        props.history.push('/login')
    }
    useEffect(() => {
        if (user) {
            set_name(user.fullname)

            set_username(user.username)

            set_email(user.email)
        }
    }, [])



    const validateAll = () => {
        let msg = {}
        if (isEmpty(name)) {
            msg.name = "Name không được để trống"
        }
        setValidationMsg(msg)
        if (Object.keys(msg).length > 0) return false;
        return true;
    }

    const handleSubmit = async () => {
        const isValid = validateAll();
        if (!isValid) return

        const query = '?' + queryString.stringify({ name: name, id: user._id })

        const response = await userAPI.update(query)
        if (response.msg === "Bạn đã update thành công") {
            changeProfile(name)
        }

        setMessage(response.msg)
    }

    const validateAllPassword = () => {
        let msg = {}
        if (isEmpty(password)) {
            msg.password = "Old password không được để trống"
        }
        if (isEmpty(new_password)) {
            msg.new_password = "New password không được để trống"
        }
        if (compare_password !== new_password) {
            msg.compare_password = "Xác nhận password không đúng"
        }
        setValidationMsg(msg)
        if (Object.keys(msg).length > 0) return false;
        return true;
    }


    const changePassword = async () => {
        const isValid = validateAllPassword();
        if (!isValid) return
        const query = '?' + queryString.stringify({ password: password, newPassword: new_password, id: user._id })

        const response = await userAPI.changePassword(query)
        console.log(response)

        setMessage1(response.msg)
    }


    return (
        <div className="container mt-5 pt-4" style={{ paddingBottom: '4rem' }}>
            <div className="group_profile">
                <div className="group_setting mt-3">
                    <div className="setting_left">
                        <div className={edit_status === 'edit_profile' ? 'setting_item setting_item_active' : 'setting_item'}
                            onClick={() => handler_Status('edit_profile')}>

                            <a className={edit_status === 'edit_profile' ? 'a_setting_active' : ''}
                                style={{ fontSize: '1.1rem' }}>Edit Profile</a>

                        </div>

                        <div className={edit_status === 'change_password' ? 'setting_item setting_item_active' : 'setting_item'}
                            onClick={() => handler_Status('change_password')}>

                            <a className={edit_status === 'change_password' ? 'a_setting_active' : ''}
                                style={{ fontSize: '1.1rem' }}>Change Password</a>

                        </div>
                    </div>
                    <div className="setting_right">
                        {
                            edit_status === 'edit_profile' ? (
                                <div className="setting_edit_profile">
                                    <p className="text-success text-center">{message ? message : ""}</p>
                                    <div className="txt_setting_edit pt-3 pb-2">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span style={{ fontWeight: '600' }}>Name</span>
                                        </div>
                                        <div>
                                            <input className="txt_input_edit" type="text" value={name}
                                                onChange={(e) => set_name(e.target.value)} required />
                                            <p className="text-danger">{validationMsg.name}</p>
                                        </div>

                                    </div>
                                    <div className="txt_setting_edit pt-3 pb-2">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span style={{ fontWeight: '600' }}>Username</span>
                                        </div>
                                        <div>
                                            <input className="txt_input_edit" type="text" value={username} disabled={true} />
                                        </div>
                                    </div>
                                    <div className="txt_setting_edit pt-3">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span style={{ fontWeight: '600' }}>Email</span>
                                        </div>
                                        <div>
                                            <input className="txt_input_edit" type="text" disabled={true} value={email} />
                                        </div>
                                    </div>
                                    <div className="txt_setting_edit pt-3">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span style={{ fontWeight: '600' }}>Hạng</span>
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: '600' }}>{user.id_rank ? user.id_rank.rank : "Chưa có hạng"}</span>

                                        </div>
                                        <div>

                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center pb-4">
                                        <button onClick={handleSubmit} className="register-button">Submit</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="setting_change_password">
                                    {
                                        message1 === "Bạn đã update thành công" ?
                                            (
                                                <p className="text-success text-center">{message1}</p>
                                            ) :
                                            (
                                                <p className="text-danger text-center">{message1}</p>
                                            )
                                    }

                                    <div className="txt_setting_edit pt-3 pb-2">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span style={{ fontWeight: '600' }}>Old Password</span>
                                        </div>
                                        <div>
                                            <input className="txt_input_edit" type="password" value={password}
                                                onChange={(e) => set_password(e.target.value)} />
                                            <p className="text-danger">{validationMsg.password}</p>
                                        </div>
                                    </div>
                                    <div className="txt_setting_edit pt-3 pb-2">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span style={{ fontWeight: '600' }} >New Password</span>
                                        </div>
                                        <div>
                                            <input className="txt_input_edit" type="password" value={new_password}
                                                onChange={(e) => set_new_password(e.target.value)} />
                                            <p className="text-danger">{validationMsg.new_password}</p>
                                        </div>
                                    </div>
                                    <div className="txt_setting_edit pt-3">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span style={{ fontWeight: '600' }}>Confirm New Password</span>
                                        </div>
                                        <div>
                                            <input className="txt_input_edit" type="password" value={compare_password} onChange={(e) => set_compare_password(e.target.value)} />
                                            <p className="text-danger">{validationMsg.compare_password}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center pb-4 align-items-center">
                                        <button onClick={changePassword} className="register-button">Change Password</button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;