

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
    checkIsLoggedIn() ? <Component {...props} /> : <Redirect to={"/auth/login"} />
)

export const checkIsLoggedIn = () => {
    const token = getToken()

    if (token) {
        return true
    }

    return false
}

export const getToken = () => {
    return localStorage.getItem("credentials") || null
    // return true
}

export default class UrlHelper {
    static basename = "/crud-generator"

    static urlWrapper(url) {
        if (process.env.NODE_ENV === 'development') {
            return url
        } else if (process.env.NODE_ENV === 'production') {
            return `${this.basename}${url}` 
        }
    }   
}



// ENV

// export const Environments = { Production: 'production', Development: 'development', Default: 'default' };

// export function useEnvironment() {
//     const [environment, environment_set] = useState();

//     useEffect(() => {
//         if (process.env.NODE_ENV) {
//             switch (process.env.NODE_ENV) {
//                 case Environments.Production:
//                     environment_set(Environments.Production);
//                     break;
//                 case Environments.Development:
//                     environment_set(Environments.Development);
//                     break;
//                 default:
//                     environment_set(Environments.Default);
//             }
//         }
//     }, []);

//     return environment;
// }