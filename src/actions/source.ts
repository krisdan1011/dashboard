import {
    CREATE_SOURCE_SUCCESS,
    SET_CURRENT_SOURCE,
    SET_SOURCES
} from "../constants";
import Source from "../models/source";
import service from "../services/source";

export type SetCurrentSource = {
    type: SET_CURRENT_SOURCE,
    source: Source
}

export function setCurrentSource(source: Source): SetCurrentSource {
    return {
        type: SET_CURRENT_SOURCE,
        source: source
    };
}

export type SetSources = {
    type: SET_SOURCES,
    sources: Source[]
}

export function setSources(sources: Source[]): SetSources {
    return {
        type: SET_SOURCES,
        sources: sources
    };
}

export function getSources(): Redux.ThunkAction<any, any, any> {
    return function (dispatch: Redux.Dispatch<any>) {
        service.getSources().then(function (retVal) {
            if (!retVal.val()) {
                dispatch(setSources([]));
            } else {
                let keys = Object.keys(retVal.val());
                let sources: Source[] = [];

                for (let key of keys) {
                    service.getSource(key).then(function (data) {
                        let newSource = new Source(data.val());
                        sources.push(newSource);
                        // Dispatch the array of sources, note the .slice() is to make
                        // a copy of the sources array.  This is needed otherwise redux
                        // will not recognize it is a new array coming and not update
                        // the components
                        dispatch(setSources(sources.slice()));
                    });
                }
            }
        });
    };
}

export type CreateSourceSuccess = {
    type: CREATE_SOURCE_SUCCESS;
    source: Source;
}

export function createSourceSuccess(source: Source): CreateSourceSuccess {
    return {
        type: CREATE_SOURCE_SUCCESS,
        source: source
    };
}
