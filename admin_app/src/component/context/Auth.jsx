import React, { createContext, useState, useEffect } from 'react';
import UserAPI from '../Api/userAPI';
import cookie from 'react-cookies'

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const [jwt, setJWT] = useState();
    const [user, setUser] = useState();

    useEffect(() => {
        const fetchAllData = async (jwt, user) => {
            const response = await UserAPI.checkLogin({ jwt: jwt, user: user })
            console.log(response)

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
        const expires = new Date()
        expires.setDate(Date.now() + 1000 * 60 * 60 * 24 * 14)
        cookie.save('jwt', jwt, { expires })
        cookie.save('user', JSON.stringify(user), { expires })
        setJWT(jwt);
        setUser(user);
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
                setJWT,
                setUser
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;