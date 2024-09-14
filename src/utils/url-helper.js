

export default class UrlHelper {
    static basename = "/crud-generator"

    static urlWrapper(url) {
        if (process.env.NODE_ENV === 'development') {
            return `${this.basename}${url}`
        } else if (process.env.NODE_ENV === 'production') {
            return `${this.basename}${url}` 
        }
    }   
}