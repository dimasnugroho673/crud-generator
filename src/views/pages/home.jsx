import React, { Component } from "react";
import { withRouter, Link, Redirect } from 'react-router-dom';
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import UrlHelper from "../../utils/url-helper";

class Home extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        // window.location.href = UrlHelper.urlWrapper("/auth/login")
    }

    render() {
        return (
            <>
                <Redirect to={"/auth/login"} />
                {/* <div>Halaman Home</div>
                <div>Apps env: {process.env.NODE_ENV}</div>

                <br />
                <Link to="/dashboard">Dashboard</Link>
                <br />
                <Link to="/project-canvas">Project Canvas</Link> */}
            </>
        )
    }
}

export default Home;