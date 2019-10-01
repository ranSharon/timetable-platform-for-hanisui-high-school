import {
    SET_CURRENT_USER,
    USER_LOADING,
    GET_NEW_USER,
    UPDATE_REGISTER_STATUS
}
    from "../actions/types";
const isEmpty = require("is-empty");

const initialState = {
    isAuthenticated: false,
    currentUser: {},
    newUser: {},
    loading: false,
    registerSuccessfully: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                currentUser: action.payload
            };
        case USER_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_NEW_USER:
            return {
                ...state,
                newUser: action.payload
            };
        case UPDATE_REGISTER_STATUS:
            return {
                ...state,
                registerSuccessfully: action.payload
            };
        default:
            return state;
    }
}