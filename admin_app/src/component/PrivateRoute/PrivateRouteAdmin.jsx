import React from 'react';
import {
    Route,
    Redirect
} from "react-router-dom";
import cookie from 'react-cookies'

const PrivateRouteAdmin = ({ children, ...props }) => {
    return cookie.load('jwt') && cookie.load('user') && cookie.load('user').id_permission.permission === "Admin" ? (
        <Route {...props}>{children}</Route>
    ) : (
        <Redirect to="/" />
    )


}

export default PrivateRouteAdmin;
