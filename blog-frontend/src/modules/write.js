import { createAction, handleActions } from "redux-actions";
import createRequestSaga, { createRequestActionTypes } from "../lib/createRequestSaga"; 

const INITIALIZE = 'write/INITIALIZE';
const CHANGE_FIELD = 'write/CHANGE_FIELD';


export const initialize = createAction(INITIALIZE);
export const changeField = createAction(CHANGE_FIELD, ({ key, value}) => ({
    key, 
    value,
}));

const initialState = {
    title: '',
    body: '',
    tags: []
};

const write = handleActions(
    {
        [INITIALIZE]: state => initialState,        // initialState를 넣으면 초기 상태가 바뀜
        [CHANGE_FIELD]: (state, {payload: { key, value}}) => ({
            ...state,
            [key]: value
        }),
    },
    initialState
);


export default write;

