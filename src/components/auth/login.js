import React, { Component } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {}
        };
    }

    // componentDidMount() {
    //     // If logged in and user navigates to Login page, should redirect them to dashboard
    //     if (this.props.auth.isAuthenticated) {
    //         // this.props.history.push("/dashboard");
    //         this.props.history.push("/");
    //     }
    // }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.auth.isAuthenticated) {
        //     this.props.history.push("/"); // push user to dashboard when they login
        //     // this.props.history.push("/dashboard"); // push user to dashboard when they login
        // }
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
    };

    render() {
        const { errors } = this.state;
        return (
            <div className="card w-50 mx-auto mt-5">
                <div className="card-body">
                    <div>
                        <div >
                            <div className="text-center" style={{ paddingLeft: "11.250px" }}>
                                <h4 >
                                    <b>כניסה למערכת</b>
                                </h4>
                            </div>
                            <form noValidate onSubmit={this.onSubmit}>
                                <div className="form-group text-right">
                                    <label htmlFor="email">כתובת אימייל</label>
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.email}
                                        error={errors.email}
                                        id="email"
                                        type="email"
                                        className={classnames("form-control", {
                                            invalid: errors.email || errors.emailnotfound
                                        })}
                                        placeholder="כתובת אימייל" />
                                    <span className="text-danger">
                                        {errors.email}
                                        {errors.emailnotfound}
                                    </span>
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="password">סיסמה</label>
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.password}
                                        error={errors.password}
                                        id="password"
                                        type="password"
                                        className={classnames("form-control", {
                                            invalid: errors.password || errors.passwordincorrect
                                        })}
                                        placeholder="סיסמה" />
                                    <span className="text-danger">
                                        {errors.password}
                                        {errors.passwordincorrect}
                                    </span>
                                </div>
                                <button type="submit" className="btn btn-secondary">כניסה</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);