import * as actionTypes from "actions/actionTypes";

export const setUserRelaunch = (data: any) => ({
  type: actionTypes.SET_USER_RELAUNCH,
  payload: data,
});

export const setUserLogin = (data: any) => ({
  type: actionTypes.SET_USER_LOGIN,
  payload: data,
});

export const setUserLoginSuccess = () => ({
  type: actionTypes.SET_USER_LOGIN_SUCCESS
});

export const setUserLoginFail = (err: any) => ({
  type: actionTypes.SET_USER_LOGIN_FAIL,
  message: err,
});

export const setFaceBookLogin = (data: any) => ({
  type: actionTypes.SET_FACEBOOK_LOGIN,
  payload: data,
});

export const setFaceBookLoginSuccess = (users: any) => ({
  type: actionTypes.SET_FACEBOOK_LOGIN_SUCCESS,
  users,
});

export const setFaceBookLoginFail = (err: any) => ({
  type: actionTypes.SET_FACEBOOK_LOGIN_FAIL,
  message: err,
});

export const setUserLogout = () => ({
  type: actionTypes.SET_USER_LOGOUT,
});

export const setFacebookLogout = () => ({
  type: actionTypes.SET_FACEBOOK_LOGOUT,
});

