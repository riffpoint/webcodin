import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Page404 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="main-content">
                <div className="content">
                    <div className="section-content">
                        <div className="container wysiwyg">
                            <h2>
                                404 Error
                            </h2>
                            <p>
                                Please check if you have typed the address correctly. If you were on a previous page of our website, you can return to that page by clicking your browser’s back button.
                                <br/>
                                Go to <Link to="/">Homepage.</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}