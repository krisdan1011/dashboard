import * as Firebase from "firebase";

import { FirebaseUser } from "../models/user";
import User from "../models/user";

/**
 * Auth Service
 */
namespace auth {

    export function loginWithGithub(callback: (success: boolean, error?: string) => void) {
        let provider = new Firebase.auth.GithubAuthProvider();
        loginWithProvider(provider, callback);
    }

    function loginWithProvider(provider: firebase.auth.AuthProvider, callback: (success: boolean, error?: string) => void): void {
        Firebase.auth().signInWithPopup(provider).then(function(result) {
            if (result.user !== undefined) {
                let user: Firebase.User = result.user;
                localStorage.setItem("user", JSON.stringify(new FirebaseUser(user)));
                callback(true);
            }
            // TODO: Potential error condition here that needs to be handled
        }).catch(function(error) {
            console.log("Error logging In: " + error.message);
            callback(false, error.message);
        });
    }

    export function login(email: string, password: string, callback: (success: boolean, error?: string) => void): void {
        Firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            console.log("Error logging In: " + error.message);
            callback(false, error.message);
        }).then(function(user: Firebase.User) {
            localStorage.setItem("user", JSON.stringify(new FirebaseUser(user)));
            callback(true);
        });
    }

    export function logout(callback: (success: boolean, error?: string) => void): void {
        Firebase.auth().signOut().catch(function(error) {
            callback(false, error.message);
        }).then(function() {
            localStorage.removeItem("user");
            callback(true);
        });
    }

    export function user(): User | undefined {
        return localStorage.getItem("user") ? new User(JSON.parse(localStorage.getItem("user"))) : undefined;
    }
}

export default auth;
