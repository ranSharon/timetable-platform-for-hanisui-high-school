import axios from "axios";

import {
    SET_All_USERS,
    GET_ERRORS
} from "./types";

// Register User
export const getAllUsers = () => dispatch => {
    axios
        .get("api/users")
        .then(res =>
            dispatch({
                type: SET_All_USERS,
                payload: res.data
            })
        )
        .catch(err => {
            console.log(err.response.data);
            return dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        }
        );
};

export const deleteUser = (userId, newUsersArray) => dispatch => {
    console.log(userId);
    axios
        .delete("api/users/" + userId)
        .then(res =>
            console.log(res.data)
            // dispatch({
            //     type: SET_All_USERS,
            //     payload: res.data
            // })
        )
        .catch(err => {
            console.log(err.response.data);
            return dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        }
        );
};

export const setAllUsers = (newUsersArray) => dispatch => {
    dispatch({
        type: SET_All_USERS,
        payload: newUsersArray
    })
};