import { combineReducers } from 'redux';

import { authentication } from './auth.reducer';
import { register } from './register.reducer';
import { alert } from './alert.reducer';

const rootReducer = combineReducers({
  authentication,
  alert,
  register
});

export default rootReducer;