import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, { createRequestActionTypes } from '../lib/createRequestSaga';
import * as authAPI from '../lib/api/auth';


// 액션
const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes('auth/REGISTER');
const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes('auth/LOGIN');

// 액션함수
// form input field text change Action Function
export const changeField = createAction(
    CHANGE_FIELD,
    ({ form, key, value}) => ({
      form,
      key,
      value,
    }),
);
// form tag initialize Action Function
export const initializeForm = createAction(INITIALIZE_FORM, form => form);
// register 
export const register = createAction(REGISTER, ({username, password}) => ({
  username,
  password
}));
// login
export const login = createAction(LOGIN, ({username, password}) => ({
  username,
  password
}))

// 사가 생성
const registerSaga = createRequestSaga(REGISTER, authAPI.register);
const loginSaga = createRequestSaga(LOGIN, authAPI.login);
export function* authSaga() {
  yield takeLatest(REGISTER, registerSaga);
  yield takeLatest(LOGIN, loginSaga);
}


// 초기 값
const initialState = {
  register: {
    username: '',
    password: '',
    passwordConfirm: ''
  },
  login: {
    username: '',
    password: '',
  },
  auth: null,
  authError: null,
};

// reduce
const auth = handleActions(
  {
    [CHANGE_FIELD]: (state, { payload: { form, key, value}}) =>
      produce(state, draft => {
        draft[form][key] = value;
      }),
    [INITIALIZE_FORM]: (state, { payload: form }) => ({
      ...state,
      [form]: initialState[form],
    }),
    // 회원가입 성공
    [REGISTER_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      authError: null,
      auth
    }),
    [REGISTER_FAILURE]: (state, { payload:error }) => ({
      ...state,
      authError: error,      
    }),
    [LOGIN_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      authError: null,
      auth
    }),
    [LOGIN_FAILURE]: (state, { payload: error}) => ({
      ...state,
      authError: error
    }),
  },
  initialState,
)

export default auth;
