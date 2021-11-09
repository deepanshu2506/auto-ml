import { userService } from '../services';
import { appConstants, history } from '../helpers';

import { alertActions } from './alert.actions';

export const userActions = {
  login,
  logout,
  register
};

function login(user) {
  return dispatch => {
    dispatch(request(user));
    userService.login(user)
      .then(
        user => {
          dispatch(success(user));
          history.push(`/datasets/`);
        },
        error => {
          console.log(error, 'error--------------------------')
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request(user) {
    return {
      type: appConstants.LOGIN_REQUEST,
      user
    }
  }

  function success(user) {
    return {
      type: appConstants.LOGIN_SUCCESS,
      user
    }
  }

  function failure(error) {
    return {
      type: appConstants.LOGIN_FAILURE,
      error
    }
  }
}

function logout() {
  userService.logout();
  return { type: appConstants.LOGOUT };
}

function register(user) {
  return dispatch => {
    dispatch(request(user));
    userService.register(user)
      .then(
        user => {
          dispatch(success());
          history.push(`/login`);
          dispatch(alertActions.success('Registration successful. Login to Continue!'));
        },
        error => {
          console.log(error, 'error--------------------------')
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function request(user) {
    return {
      type: appConstants.REGISTER_REQUEST,
      user
    }
  }
  function success(user) {
    return {
      type: appConstants.REGISTER_SUCCESS,
      user
    }
  }
  function failure(error) {
    return {
      type: appConstants.REGISTER_FAILURE,
      error
    }
  }
}