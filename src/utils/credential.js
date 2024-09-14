import Constant from "./constant"

export default class Credentials {

    static set = (data) => {
        localStorage.setItem('credentials', data)
    }

    static get = () => {
        const credentials = JSON.parse(localStorage.getItem(Constant.credentialKey))

        return credentials
    }

    static clear = () => {
        localStorage.removeItem(Constant.credentialKey)

        return true
    }
}