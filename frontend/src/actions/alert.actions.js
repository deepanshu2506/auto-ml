import { appConstants } from '../helpers/';
 
export const alertActions = {
  success,
  error,
  clear
};
 
function success(message) {
  return { type: appConstants.SUCCESS, message };
}
 
function error(message) {
  return { type: appConstants.ERROR, message };
}
 
function clear() {
  return { type: appConstants.CLEAR };
}