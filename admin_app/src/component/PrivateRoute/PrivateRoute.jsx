import React, { useContext } from 'react';
import {
    Route,
    Redirect
} from "react-router-dom";
import cookie from "react-cookies"

const PrivateRoute = ({ children, ...props }) => {
    return cookie.load('jwt') && cookie.load('user') && cookie.load('user').id_permission.permission === "Nhân Viên" ? (
        <Route {...props}>{children}</Route>
    ) : (
        <Redirect to="/" />
    )
}

export default PrivateRoute;
