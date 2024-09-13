import { Route, Redirect } from "react-router-dom";

// harus return jsx!!
export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => <GateAuthorization component={Component} {...props} />} />
)

export const NonSessionRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => <GateDeauthorization component={Component} {...props} />} />
)

export const GateDeauthorization = ({ component: Component, ...props }) => (
    !checkIsLoggedIn() ? <Component {...props} /> : window.location.href = "/dashboard"
)

export const GateAuthorization = ({ component: Component, ...props}) => (
    checkIsLoggedIn() ? <Component {...props} /> : <Redirect to="/auth/login" />
)

export const checkIsLoggedIn = () => {
    const token = getToken()

    if (token) {
        return true
    }

    return false
}

export const getToken = () => {
    // return localStorage.getItem("token") || null
    return true
}