import React, { Component } from "react";
import { withRouter, Link } from 'react-router-dom';
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";

class Home extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <div>Halaman Home</div>
                <div>Apps env: {process.env.NODE_ENV}</div>

                <br />
                <Link to="/dashboard">Dashboard</Link>
                <br />
                <Link to="/project-canvas">Project Canvas</Link>
            </>
        )
    }
}

export default Home;