import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser, upadateRegisterStatus } from "../../actions/authActions";
import classnames from "classnames";
import isEmpty from 'is-empty';

class Register extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
            errors: {}
        };
    }

    // componentDidMount() {
    //     // If logged in and user navigates to Register page, should redirect them to dashboard
    //     if (this.props.auth.isAuthenticated) {
    //         this.props.history.push("/dashboard");
    //     }
    // }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    componentDidUpdate() {
        if (this.props.auth.registerSuccessfully) {
            this.props.upadateRegisterStatus(false);
            this.resetInput();
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();
        const newUser = {
            name: this.state.name,
            // email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };
        this.props.registerUser(newUser);
        // this.resetInput();
    };

    resetInput = () => {
        this.setState({
            name: '',
            password: '',
            password2: '',
        })
    }

    render() {
        const { errors } = this.state;
        return (
            <div className="card w-50 mx-auto mt-5">
                <div className="card-body">
                    <div>
                        <div >
                            <div className="text-center" style={{ paddingLeft: "11.250px" }}>
                                <h4>
                                    <b>רישום משתמש חדש</b>
                                </h4>
                            </div>
                            <form noValidate onSubmit={this.onSubmit}>
                                <div className="form-group text-right">
                                    <label htmlFor="name">שם משתמש</label>
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.name}
                                        error={errors.name}
                                        id="name"
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.name
                                        })}
                                        placeholder="שם משתמש" />
                                    <span className="text-danger">{errors.name}</span>
                                </div>
                                {/* <div className="form-group text-right">
                                    <label htmlFor="email">כתובת אימייל</label>
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.email}
                                        error={errors.email}
                                        id="email"
                                        type="email"
                                        className={classnames("form-control", {
                                            invalid: errors.email
                                        })}
                                        placeholder="כתובת אימייל" />
                                    <span className="text-danger">{errors.email}</span>
                                </div> */}
                                <div className="form-group text-right">
                                    <label htmlFor="password">סיסמה</label>
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.password}
                                        error={errors.password}
                                        id="password"
                                        type="password"
                                        className={classnames("form-control", {
                                            invalid: errors.password
                                        })}
                                        placeholder="סיסמה" />
                                    <span className="text-danger">{errors.password}</span>
                                </div>
                                <div className="form-group text-right">
                                    <label htmlFor="password2">אימות סיסמה</label>
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.password2}
                                        error={errors.password2}
                                        id="password2"
                                        type="password"
                                        className={classnames("form-control", {
                                            invalid: errors.password2
                                        })}
                                        placeholder="סיסמה" />
                                    <span className="text-danger">{errors.password2}</span>
                                </div>
                                <button type="submit" className="btn btn-secondary">רשום משתמש</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    users: state.users,
    auth: state.auth,
    errors: state.errors
});

// export default connect(mapStateToProps, { registerUser })(withRouter(Register));
export default connect(mapStateToProps, { registerUser, upadateRegisterStatus })(Register);