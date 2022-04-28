import { AUTHENTICATE, LOGOUT, SET_DID_TRY_TO_LOGIN } from "../actions/auth";

const initialState = {
    token: null,
    userId: null,
    didTryToLogin: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId,
                didTryToLogin: true,
            };
        case LOGOUT:
            return initialState;
        case SET_DID_TRY_TO_LOGIN:
            return {
                ...state,
                didTryToLogin: true,
            };
        default:
            return state;
    }
};
