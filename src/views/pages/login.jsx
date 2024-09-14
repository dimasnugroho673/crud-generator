import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import AuthLayout from "../layouts/auth/layout";
import { collection, addDoc, updateDoc, getDocs, getFirestore, query, where, db, doc, documentId } from "firebase/firestore";
import firebaseConf from '../../utils/firebase-config';
import UrlHelper from "../../utils/url-helper";
import Constant from "../../utils/constant";

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSearchingCredential: false,
            results: {}
        }
    }

    componentDidMount() {
        // setTimeout(() => {
        //     window.location.href = "/dashboard"
        // }, 3000);
    }

    async attemptCredential(email) {
        try {
            const database = getFirestore(firebaseConf)

            // search users collection
            return await getDocs(query(collection(database, "users"), where('email', "==", email)))
                .then((snapshot) => {
                    return snapshot.docs.map(data => {
                        return data.data()
                    })
                })

            // return await getDocs(query(collection(database, "allowed_auth_credentials"), where('email', "==", email)))
            //     .then((snapshot) => {
            //         return snapshot.docs.map(data => {
            //             return data.data()
            //         })
            //     })
        } catch (e) {
            console.error("Error search credential: ", e)
        }
    }

    handleSubmitLogin(e) {
        e.preventDefault()

        let email = document.getElementById('auth-email').value

        this.setState({ isSearchingCredential: true })
        this.setState({ results: {} })

        this.attemptCredential(email)
            .then(data => {
                this.setState({ isSearchingCredential: false })

                if (data.length == 0) {
                    this.setState({
                        results: {
                            status: 'error',
                            data: {},
                            message: 'Credential not found!'
                        }
                    })
                } else {
                    this.setState({
                        results: {
                            status: 'success',
                            data: data[0],
                            message: 'Credential found'
                        }
                    })

                    localStorage.setItem('credentials', JSON.stringify(data[0]))
                    window.location.href = UrlHelper.urlWrapper("/dashboard")
                }
            })
    }

    render() {
        return (
            <AuthLayout>
                <div className="container container-tight py-4">
                    <div className="text-center mb-4">
                        <a href="." className="navbar-brand navbar-brand-autodark">
                            <img src={process.env.PUBLIC_URL + '/logo-mini.png'} width="110" alt={Constant.appName} class="" />
                        </a>
                    </div>
                    <div className="card card-md">
                        <div className="card-body">
                            <h2 className="h2 text-center mb-4">Login to your account</h2>

                            <div className="my-5">
                                {this.state.results.status === 'error' ? (
                                    <div class="alert alert-danger" role="alert">
                                        {this.state.results.message}
                                    </div>
                                ) : ''}
                            </div>

                            <form id="form-login" onSubmit={e => this.handleSubmitLogin(e)}>
                                <div className="mb-3">
                                    <label className="form-label">Email address</label>
                                    <input type="email" id="auth-email" name="email" className="form-control" placeholder="your@email.com" required />
                                </div>
                                <div className="form-footer">
                                    <button type="submit" className={`btn btn-primary w-100 ${this.state.isSearchingCredential ? 'disabled' : ''}`}>{this.state.isSearchingCredential ? 'Signing in...' : 'Sign in'}</button>
                                </div>
                            </form>
                        </div>
                        {/* <div className="hr-text">or</div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col"><a href="#" className="btn w-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon text-github"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" /></svg>
                                    Login with Github
                                </a></div>
                                <div className="col"><a href="#" className="btn w-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon text-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                                    Login with X
                                </a></div>
                            </div>
                        </div> */}
                    </div>
                    {/* <div className="text-center text-secondary mt-3">
                        Don't have account yet? <a href="./sign-up.html" tabIndex={-1}>Sign up</a>
                    </div> */}
                </div>
            </AuthLayout>

        )
    }
}

export default Login;