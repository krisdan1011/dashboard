import * as Firebase from "firebase";
import "isomorphic-fetch";

import { Query } from "../models/query";
import { Source } from "../models/source";
import StringUtil from "../utils/string";
import { remoteservice } from "./remote-service";

export namespace source {

    const NAME_GENERATING_URL: string = "http://ELB-ECS-SourceNameGenerator-dev-905620013.us-east-1.elb.amazonaws.com/v1/sourceName";

    export interface SourceName {
        name: string;
        secretKey: string;
    }

    /**
     * A function that will generate a unique source name.
     * @param name
     *      A name to check against.  If not provided, a random name will be supplied.
     */
    export function generateSourceName(name?: string): Promise<SourceName> {
        const query: Query = new Query();
        if (name) {
            query.add({ parameter: "name", value: name });
        }
        const finalURL = NAME_GENERATING_URL + "?" + query.query();

        const request = new Request(finalURL);
        console.info("Getting " + request.url);
        return Promise.resolve(name)
            .then(function(name: string) {
                return fetch(finalURL);
            }).then(function(result: any) {
                console.log(result);
                return result.json();
            });
    }

    export function createSource(source: Source, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<Source> {
        return new Promise(function (callback, reject) {

            // Create a new mutable source from the source passed in
            const mutableSource: any = {...{}, ...source};

            let user = auth.currentUser;
            let ref = db.ref();
            let sourcesPath = ref.child("sources");

            // Create the base key and initial key
            let baseKey = mutableSource.id;
            let key = baseKey;

            // Add the current user as the owner of the source.
            mutableSource.members[user.uid] = "owner";

            let count = 0;
            let appendLength = 5;

            // Want it to keep looping until we finally have a unique value.
            // This constantly pings the database until we have a key that doesn't exist.
            // Hopefully, it wouldn't take more than a couple iterations max.
            let renameAndTryAgain = function (): Firebase.Promise<any> {
                // Child exists, so do another with an appended key.
                ++count;
                if (count % 10 === 0) {
                    // Basically, if we've somehow gone 10 iterations because we're really
                    // popular and we keep getting collisions, then lengthen it.
                    ++appendLength;
                }

                // Update the key for later usage
                key = baseKey + "-" + StringUtil.randomString(appendLength);

                // If you can read it again with the new key, try again
                return sourcesPath.child(key).once("value")
                    .then(renameAndTryAgain)
                    .catch(setTheSource);
            };

            // When we think we found a good key, we now set the source
            // for the key.  If it fails, it generates and new key and
            // tries again.
            let setTheSource = function (): Firebase.Promise<any> {
                // Update the key with the final iteraction before saving
                mutableSource.id = key;
                return sourcesPath.child(key).set(mutableSource)
                    .then(function () {
                        // Save the source to the user's list of sources
                        ref.child("users").child(user.uid).child("sources").child(key).set("owner").then(function () {
                            // And finally provide it back to the callback
                            callback(mutableSource);
                        });
                    }).catch(renameAndTryAgain); // If it fails, keep trying
            };

            // This starts off the recursion
            // Try to read the value at the key to see if it exists
            sourcesPath.child(key).once("value")
                // If it does, we need to change the key and try again
                .then(renameAndTryAgain)
                // If it doesn't exist, it throws an error that it can't read it
                // and, we go ahead and set it
                .catch(setTheSource);
        });
    }

    export function deleteSource(source: Source, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<Source> {
        const user = auth.currentUser;
        const ref = db.ref();
        const key = source.id;

        // tslint:disable:no-null-keyword
        return ref.child("users").child(user.uid).child("sources").child(key).set(null).then(function() {
            return removeMembers(user.uid, source);
        });
        // tslint:enable:no-null-keyword
    }

    export function getSources(auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<any> {
        let user = auth.currentUser;
        let ref = db.ref();
        return ref.child("/users/" + user.uid + "/sources").once("value");
    }

    export function getSourcesObj(auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<Source[]> {
        let user = auth.currentUser;
        let ref = db.ref();

        return ref.child("/users/" + user.uid + "/sources").once("value")
            .then(function (retVal) {
                return (retVal.val()) ? Object.keys(retVal.val()) : [];
            }).then(function (keys: string[]) {
                let getPromises: Promise<Source>[] = [];
                for (let key of keys) {
                    getPromises.push(getSourceObj(key, db));
                }
                return Promise.all(getPromises);
            });
    }

    export function getSource(key: string, db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<any> {
        let ref = db.ref();
        return ref.child("/sources/" + key).once("value");
    }

    export function getSourceObj(key: string, db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<Source> {
        return getSource(key, db)
            .then(function (data) {
                let source: Source = new Source(data.val());
                return source;
            });
    }
}

export default source;

function removeMembers(memeberId: string, source: Source): Promise<Source> {
    return new Promise(function (resolve, reject) {
        const mutableSource: any = {...{}, ...source};
        mutableSource.members[memeberId] = undefined;
        resolve(mutableSource);
    });
}