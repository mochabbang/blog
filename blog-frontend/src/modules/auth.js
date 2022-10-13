import { createAction, handleActions } from 'redux-actions';

// 초기 값
const initialState = {};

// 액션 상태
const SAMPLE_ACTION = 'auth/SAMPLE_ACTION';

// 액션함수
export const sampleAction = createAction(SAMPLE_ACTION);

// reducer
const auth = handleActions(
  {
    [SAMPLE_ACTION]: (state, action) => state,
  },
  initialState,
);

export default auth;
