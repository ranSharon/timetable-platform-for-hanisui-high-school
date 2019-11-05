import React, { Component } from 'react';
import Register from './auth/register';
import { connect } from "react-redux";
import { getAllUsers } from '../actions/usersActions';
import DataTable from './dataContainers/tableDisplay/table';

class RegisterPage extends Component {

    componentDidMount() {
        this.props.getAllUsers();
    }

    render() {
        console.log(this.props.users.allUsers)
        return (
            <div>
                <Register />
                {this.props.users.usersFetched ?
                    (<DataTable
                        table="users"
                        users={this.props.users}
                    />) :
                    (<div className="text-center mt-5">
                        <div className="spinner-border" style={{ "width": "3rem", "height": "3rem" }} role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>)
                }
            </div >

        );
    }
}

const mapStateToProps = state => ({
    users: state.users,
    errors: state.errors
});

export default connect(mapStateToProps, { getAllUsers })(RegisterPage);
