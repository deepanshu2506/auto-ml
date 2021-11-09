import { appConstants } from '../helpers/app-constants';

export function alert(state = {}, action) {
  switch (action.type) {
    case appConstants.SUCCESS:
      return {
        type: 'alert-success',
        message: action.message
      };
    case appConstants.ERROR:
      return {
        type: 'alert-danger',
        message: action.message
      };
    case appConstants.CLEAR:
      return {};
    default:
      return state
  }
}