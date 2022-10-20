import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

// 액션
const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';

// 액션함수
export const changeField = createAction(
  CHANGE_FIELD,
  ({form, key, value}) => ({
    form,     // login, register
    key,      // username, password, newpassword
    value,    // 실제 바꾸려는 값
  })
)

export const initializeForm = createAction(INITIALIZE_FORM, form => form);  // register, login

// 초기 값
const initialState = {
  register: {
    username: '',
    password: '',
    passwordConfirm: ''
  },
  login: {
    username: '',
    password: ''
  }
};

// reduce
const auth = handleActions({
  [CHANGE_FIELD]: (state, {payload: {form, key, value}}) => produce(state, draft => {
    draft[form][key] = [value];     // 예: state.register.username을 바꾼다.
  }),
  [INITIALIZE_FORM]: (state, { payload: form }) => ({
    ...state,
    [form]: initialState[form],
  }),
  initialState,
})


export default auth;