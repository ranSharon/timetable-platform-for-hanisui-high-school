import React from 'react';
import { connect } from "react-redux";
import { getAllUsers, deleteUser, setAllUsers } from '../../actions/usersActions';

const UsersTableBody = (props) => {

    const deleteUser = (userId) => {
        const usersArray = [...props.users.allUsers]
        const newUsersArray = usersArray.filter(user => user._id !== userId);
        props.deleteUser(userId);
        props.setAllUsers(newUsersArray);
    }

    return (
        <tbody>
            {props.users.allUsers.map((user, index) => {
                return (
                    user.name === 'administrator' ? null :
                        <tr key={index} className="text-center">
                            <td >{user.name}</td>
                            <td >{user.date}</td>
                            <td className="text-left">
                                <button type="button" className="btn btn-secondary btn-sm mb-1" onClick={() => deleteUser(user._id)}>מחק</button>
                            </td>
                        </tr>
                );
            }
            )}
        </tbody>
    );
}

const mapStateToProps = state => ({
    users: state.users,
    errors: state.errors
});

export default connect(mapStateToProps, { getAllUsers, deleteUser, setAllUsers })(UsersTableBody);