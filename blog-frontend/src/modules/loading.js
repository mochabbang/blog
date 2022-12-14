import { createAction, handleActions } from "redux-actions";

// 액션
const START_LOADING = 'loading/START_LOADING';
const FINISH_LOADING = 'loading/FINISH_LOADING';

// 액션 함수
export const startLoading = createAction(
    START_LOADING,
    requestType => requestType,
);

export const finishLoading = createAction(
    FINISH_LOADING,
    requestType => requestType
);

// loading state 초기값 설정
const initialState = {};

// 리듀서 (실행컨텍스트)
const loading = handleActions({
    [START_LOADING]: (state, action) => ({
        ...state,
        [action.payload]: true,
    }),
    [FINISH_LOADING]: (state, action) => ({
        ...state,
        [action.payload]: false,
    }),
}, initialState);


export default loading;

