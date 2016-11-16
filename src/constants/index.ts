/*
 * These are the variables that determine what our central data store (reducer.js)
 * changes in our state. When you add a new action, you have to add a new constant here
 */

export type LOG_LEVELS = "DEBUG" | "INFO" | "WARN" | "ERROR";

export type AUTH_FORM_CHANGED = "bst/AUTH_FORM_CHANGED";
export const AUTH_FORM_CHANGED: AUTH_FORM_CHANGED = "bst/AUTH_FORM_CHANGED";

export type AUTH_FORM_ERROR = "bst/AUTH_FORM_ERROR";
export const AUTH_FORM_ERROR: AUTH_FORM_ERROR = "bst/AUTH_FORM_ERROR";

export type SET_USER = "bst/SET_USER";
export const SET_USER: SET_USER = "bst/SET_USER";

export const SENDING_REQUEST = "SENDING_REQUEST";

export const LOGIN_USER_PENDING = "bst/LOGIN_USER_PENDING";
export const LOGIN_USER_SUCCESS = "bst/LOGIN_USER_SUCCESS";
export const LOGIN_USER_ERROR = "bst/LOGIN_USER_ERROR";
export const LOGOUT_USER = "bst/LOGOUT_USER";

export type FETCH_LOGS_REQUEST = "bst/FETCH_LOGS_REQUEST";
export const FETCH_LOGS_REQUEST: FETCH_LOGS_REQUEST = "bst/FETCH_LOGS_REQUEST";

export type SET_LOGS = "bst/SET_LOGS";
export const SET_LOGS: SET_LOGS = "bst/SET_LOGS";

export type SET_CURRENT_SOURCE = "bst/SET_CURRENT_SOURCE";
export const SET_CURRENT_SOURCE: SET_CURRENT_SOURCE = "bst/SET_CURRENT_SOURCE";

export type SET_SOURCES = "bst/SET_SOURCES";
export const SET_SOURCES: SET_SOURCES = "bst/SET_SOURCES";

export type CREATE_SOURCE_REQUEST = "bst/CREATE_SOURCE_REQUEST";
export const CREATE_SOURCE_REQUEST: CREATE_SOURCE_REQUEST = "bst/CREATE_SOURCE_REQUEST";

export type CREATE_SOURCE_SUCCESS = "bst/CREATE_SOURCE_SUCCESS";
export const CREATE_SOURCE_SUCCESS: CREATE_SOURCE_SUCCESS = "bst/CREATE_SOURCE_SUCCESS";

export type CREATE_SOURCE_ERROR = "bst/CREATE_SOURCE_ERROR";
export const CREATE_SOURCE_ERROR: CREATE_SOURCE_ERROR = "bst/CREATE_SOURCE_ERROR";

export type FETCH_SOURCES_REQUEST = "bst/FETCH_SOURCES_REQUEST";
export const FETCH_SOURCES_REQUEST: FETCH_SOURCES_REQUEST = "bst/FETCH_SOURCES_REQUEST";

export type FETCH_SOURCE_SUCCESS = "bst/FETCH_SOURCES_SUCCESS";
export const FETCH_SOURCES_SUCCESS: FETCH_SOURCE_SUCCESS = "bst/FETCH_SOURCES_SUCCESS";

export type SET_SNACKBAR_MESSAGE = "bst/SET_SNACKBAR_MESSAGE";
export const SET_SNACKBAR_MESSAGE: SET_SNACKBAR_MESSAGE = "bst/SET_SNACKBAR_MESSAGE";

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