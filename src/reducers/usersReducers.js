import { SET_All_USERS, ADD_NEW_USER } from "../actions/types";

const initialState = {
    allUsers: [],
    usersFetched: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_All_USERS:
            return {
                ...state,
                allUsers: [...action.payload],
                usersFetched: true
            };
        case ADD_NEW_USER:
            return {
                ...state,
                allUsers: [...state.allUsers,action.payload],
            };
        default:
            return state;
    }
}