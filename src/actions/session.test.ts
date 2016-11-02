import * as chai from "chai";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as sinon from "sinon";

import { SET_USER } from "../constants";
import User from "../models/user";
import auth from "../services/auth";
import * as session from "./session";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let expect = chai.expect;

describe("Session.ts", function () {
    describe("Session Actions", function () {
        it("sets the user", function () {
            let user = new User({ email: "email" });
            let initialState = {};

            let store = mockStore(initialState);
            store.dispatch(session.setUser(user));

            expect(store.getActions().length).to.equal(1);
            let action: any = store.getActions()[0];
            expect(action.type).to.equal(SET_USER);
        });
    });

    describe("ToPath callbacks", function() {
        it ("Tests the toPath callback to ensure it goes to the appropriate location.", function() {
            // The callback should replace the current page to the base page "/TestPath".
            let callback = new session.ToPathCallback("/TestPath");
            let initialState = {};
            let store = mockStore(initialState);

            callback.loginSuccess(store.dispatch, new User({email: "email"}));

            expect(store.getActions().length).to.equal(1);

            let action: any = store.getActions()[0];
            expect(action.payload.method).to.equal("replace"); // This is redux-route method which could change as that library changes.
            expect(action.payload.args[0]).to.equal("/TestPath");
        });
    });

    describe("Back callback", function() {
        it ("Tests the Back method actually goes back to the previous age.", function() {
            // The callback should perform a "back" option.
            let callback = new session.BackCallback();
            let initialState = {};
            let store = mockStore(initialState);

            callback.loginSuccess(store.dispatch, new User({email: "email"}));

            expect(store.getActions().length).to.equal(1);

            let action: any = store.getActions()[0];
            expect(action.payload.method).to.equal("goBack"); // This is redux-route method which could change as that library changes.
        });
    });

    describe("Successful login With Github", function() {

        let loginGithubStub: Sinon.SinonStub;
        let setUserStub: Sinon.SinonStub;

        before("Stubbing auth namespace.", function() {
            loginGithubStub = sinon.stub(auth, "loginWithGithub", (callback: (success: boolean, error?: string) => void) => {
                callback(true, undefined);
            });

            setUserStub = sinon.stub(auth, "user", () => {
                return new User({ email: "testEmail" });
            });
        });

        after(function() {
            loginGithubStub.restore();
            setUserStub.restore();
        });

        it ("Tests the login flow works properly on a successful github login with a default login strategy.", function() {
            verifySuccessLogin("/", (store: any) => {
                session.loginWithGithub()(store.dispatch);
            });
        });

        it ("Tests the login flow works properly on successful github login with overridden login strategy.", function() {
            verifySuccessLogin("/NextPath", (store: any) => {
                session.loginWithGithub(new session.ToPathCallback("/NextPath"))(store.dispatch);
            });
        });
    });

    describe("Successful login with username and password", function() {

        let loginStub: Sinon.SinonStub;
        let setUserStub: Sinon.SinonStub;

        before("Stubbing auth namespace.", function() {
            loginStub = sinon.stub(auth, "login", (email: string, password: string, callback: (success: boolean, error?: string) => void) => {
                callback(true, undefined);
            });

            setUserStub = sinon.stub(auth, "user", () => {
                return new User({ email: "testEmail" });
            });
        });

        after(function() {
            loginStub.restore();
            setUserStub.restore();
        });

        it ("Tests the login flow works properly on a successful username and password login with a default login strategy.", function() {
            verifySuccessLogin("/", (store: any) => {
                session.login("testuser", "secretPassword")(store.dispatch);
            });
        });

        it ("Tests the login flow works properly on successful username and password login with overridden login strategy.", function() {
            verifySuccessLogin("/NextPath", (store: any) => {
                session.login("testuser", "secretPassword", new session.ToPathCallback("/NextPath"))(store.dispatch);
            });
        });
    });

    describe("Unsuccessful login with Github", function() {
        let loginStub: Sinon.SinonStub;
        let setUserStub: Sinon.SinonStub;

        before("Stubbing auth namespace.", function() {
            loginStub = sinon.stub(auth, "login", (email: string, password: string, callback: (success: boolean, error?: string) => void) => {
                callback(false, "Login error.");
            });

            setUserStub = sinon.stub(auth, "user", (): User => {
                return undefined;
            });
        });

        after(function() {
            loginStub.restore();
            setUserStub.restore();
        });

        it ("Tests the login flow works properly on an unsuccessful login attempt.", function() {
            verifyUnsuccessfullLogin(() => {
                session.loginWithGithub();
            });
        });
    });

    describe("Unsuccessful login with username and password", function() {
        let loginStub: Sinon.SinonStub;
        let setUserStub: Sinon.SinonStub;

        before("Stubbing auth namespace.", function() {
            loginStub = sinon.stub(auth, "login", (email: string, password: string, callback: (success: boolean, error?: string) => void) => {
                callback(false, "Login error.");
            });

            setUserStub = sinon.stub(auth, "user", (): User => {
                return undefined;
            });
        });

        after(function() {
            loginStub.restore();
            setUserStub.restore();
        });

        it ("Tests the login flow works properly on an unsuccessful login attempt.", function() {
            verifyUnsuccessfullLogin(() => {
                session.login("testAccount@test.com", "12345-the-kind-of-password-an-idiot-would-have-on-his-luggage");
            });
        });
    });

    describe("Logout", function() {
        let logoutStub: Sinon.SinonStub;

        before("Stubbing auth logout.", function() {
            logoutStub = sinon.stub(auth, "logout", (callback: (success: boolean, error?: string) => void) => {
                callback(true);
            });
        });

        after(function() {
            logoutStub.restore();
        });

        it("Verifies a successful logout actions.", function() {
            let initialState = {};
            let store = mockStore(initialState);

            store.dispatch(session.logout());

            console.info(store.getActions());

            expect(store.getActions().length).to.equal(1);

            let finalAction: any = store.getActions()[store.getActions().length - 1];
            expect(finalAction.payload.method).to.equal("push"); // This is redux-route method which could change as that library changes.
            expect(finalAction.payload.args[0]).to.equal("/login");
        });
    });

    function verifySuccessLogin(redirectPath: string, loginAction: (store: any) => void) {
        let initialState = {};
        let store = mockStore(initialState);

        loginAction(store);

        expect(store.getActions().length).to.greaterThan(0);

        // TODO: Right now these are assuming that the "setUserAction" and the "redirectAction" are the last two
        // actions being dispatched, but really what's important is that "setUser" is before the "redirect". This can be
        // generic.
        let setUserAction: any = store.getActions()[store.getActions().length - 2];
        let redirectAction: any = store.getActions()[store.getActions().length - 1];

        verifyUserAction(setUserAction);
        verifyReplaceAction(redirectAction, redirectPath);
    }

    function verifyUnsuccessfullLogin(loginAction: (store: any) => void) {
        let initialState = {};
        let store = mockStore(initialState);

        loginAction(store);

        expect(store.getActions().length).to.equal(0);
    }

    function verifyUserAction(action: any) {
        expect(action.type).to.equal(SET_USER);
        expect(action.user.email).to.equal("testEmail");
    }

    function verifyReplaceAction(action: any, path: string) {
        expect(action.payload.method).to.equal("replace"); // This is redux-route method which could change as that library changes.
        expect(action.payload.args[0]).to.equal(path);
    }
});