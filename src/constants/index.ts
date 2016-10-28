/*
 * AppConstants
 * These are the variables that determine what our central data store (reducer.js)
 * changes in our state. When you add a new action, you have to add a new constant here
 *
 */

export type CHANGE_FORM = "bst/CHANGE_FORM";
export const CHANGE_FORM: CHANGE_FORM = "bst/CHANGE_FORM";

export const SET_AUTH = "SET_AUTH";
export const SET_USER = "SET_USER";
export const SENDING_REQUEST = "SENDING_REQUEST";

export const LOGIN_USER_PENDING = "bst/LOGIN_USER_PENDING";
export const LOGIN_USER_SUCCESS = "bst/LOGIN_USER_SUCCESS";
export const LOGIN_USER_ERROR = "bst/LOGIN_USER_ERROR";
export const LOGOUT_USER = "bst/LOGOUT_USER";

export type FETCH_LOGS_REQUEST = "bst/FETCH_LOGS_REQUEST";
export const FETCH_LOGS_REQUEST: FETCH_LOGS_REQUEST = "bst/FETCH_LOGS_REQUEST";
export type SET_LOGS = "bst/SET_LOGS";
export const SET_LOGS: SET_LOGS = "bst/SET_LOGS";

export namespace CLASSES {
    export namespace COLOR {
        export const BLUE_GREY_800 = "mdl-color--blue-grey-800";
        export const BLUE_GREY_900 = "mdl-color--blue-grey-900";
        export const GREY_100 = "mdl-color--grey-100";
        export const GREY_900 = "mdl-color--grey-900";
    }

    export namespace TEXT {
        export const BLUE_GREY_50 = "mdl-color-text--blue-grey-50";
        export const BLUE_GREY_400 = "mdl-color-text--blue-grey-400";
        export const GREY_600 = "mdl-color-text--grey-600";
    }
}