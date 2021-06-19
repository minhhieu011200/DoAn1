import React, { createContext, useState, useEffect } from 'react';
import cookie from 'react-cookies'
import UserAPI from '../API/user';


export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const [jwt, setJWT] = useState('');
    const [user, setUser] = useState();

    useEffect(() => {
        const fetchAllData = async (jwt, user) => {
            const response = await UserAPI.checkLogin({ jwt: jwt, user: user })

            if (response.msg === "Thành công") {
                setJWT(cookie.load('jwt'))
                setUser(cookie.load('user'))
            }
            else {
                window.location.href = "/"
                cookie.remove('jwt')
                cookie.remove('user')

            }
        }

        if (cookie.load('jwt') || cookie.load('user')) {
            fetchAllData(cookie.load('jwt'), cookie.load('user'))
        } else {
            cookie.remove('jwt')
            cookie.remove('user')
        }
    }, [])

    const addLocal = (jwt, user) => {
        cookie.save('jwt', jwt)
        cookie.save('user', JSON.stringify(user))

        setJWT(jwt);
        setUser(user);
    }

    const changeProfile = (name) => {
        user.fullname = name;
        cookie.save('user', JSON.stringify(user))
        setUser({ ...user, fullname: name });
    }

    const logOut = () => {
        cookie.remove('jwt')
        cookie.remove('user')

        setJWT();
        setUser();
    }


    return (
        <AuthContext.Provider
            value={{
                jwt,
                user,
                addLocal,
                logOut,
                changeProfile
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;