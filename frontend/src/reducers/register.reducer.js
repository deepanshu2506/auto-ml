import { appConstants } from '../helpers/app-constants';

export function register(state = {}, action) {
  switch (action.type) {
    case appConstants.REGISTER_REQUEST:
      return { registering: true };
    case appConstants.REGISTER_SUCCESS:
      return {};
    case appConstants.REGISTER_FAILURE:
      return {};
    default:
      return state
  }
}