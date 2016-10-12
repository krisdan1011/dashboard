import { SENDING_REQUEST, SET_AUTH, SET_USER } from "../constants";
import { browserHistory } from 'react-router';
import User from "../models/user";
import auth from "../services/auth";

export function sendingRequest(sending: boolean) {
  return {
    type: SENDING_REQUEST,
    sending
  };
}

export function setAuthToken(token?: string) {
  return {
    type: SET_AUTH,
    token
  };
}

export function setUser(email: string) {
  return {
    type: SET_USER,
    user: new User({email: email})
  };
}

export function login(email: string, password: string) {

  return function (dispatch: Redux.Dispatch<any>) {

    dispatch(sendingRequest(true));

    auth.login(email, password, (success) => {

        dispatch(sendingRequest(false));
        dispatch(setUser(email));

        if (success) {
          browserHistory.push("/");
        }
    });
  };
}

export function logout() {
  console.log("log out");
  auth.logout();
  browserHistory.push("/login");
}