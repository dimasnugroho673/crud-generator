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
                <Link to="/dashboard">Dashboard</Link>
                <br />
                <Link to="/project-canvas">Project Canvas</Link>
            </>
        )
    }
}

export default Home;