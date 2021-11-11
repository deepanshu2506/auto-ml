import { combineReducers } from 'redux';

import { authentication } from './auth.reducer';
import { register } from './register.reducer';
import { alert } from './alert.reducer';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import { appConstants } from '../helpers/app-constants';
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user','loggedIn']
};

const appReducer= combineReducers({
  authentication: persistReducer(persistConfig, authentication),
  alert,
  register
});

const rootReducer = (state, action) => {
  console.log(action.type)
  if (action.type === appConstants.LOGOUT) {
    //clear redux persist state
    storage.removeItem('persist:root')
    window.location.reload();
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;