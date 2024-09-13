import { Component } from "react";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({ component: Component, ...rest }) => {
    <Route {...rest} render={props => <GateAuthorization component={component} {...props} />} />
}

export const GateAuthorization = ({ component: Component, ...props}) => {
    if (checkIsLoggedIn()) {
        <Component {...props} />
    } else {
        <Redirect to="/auth/login" />
    }
}

export const checkIsLoggedIn = () => {
    const token = getToken()

    if (token) {
        return true
    }

    return false
}

export const getToken = () => {
    return localStorage.getItem("token") || null
}