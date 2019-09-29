import React, { Component } from "react";
import { Link, Route, Redirect } from "react-router-dom";
import Login from './auth/login';
import Register from './auth/register';

class Landing extends Component {
    render() {
        return (
            <div >
                <div >
                    <Link to="/register">Register</Link>
                </div>
                <div>
                    <Link to="/login">Log In</Link>
                </div>
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
            </div>
        );
    }
}
export default Landing;