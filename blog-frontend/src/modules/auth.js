import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { createRequestActionTypes } from '../lib/createRequestSaga';

// 액션
const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes('auth/REGISTER');
const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes('auth/LOGIN');

// 액션함수
export const changeField = createAction(
    CHANGE_FIELD,
    ({ form, key, value}) => ({
      form,
      key,
      value,
    }),
);

export const initializeForm = createAction(INITIALIZE_FORM, form => form);

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
  },
  initialState,
)

export default auth;
