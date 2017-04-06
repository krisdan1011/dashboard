import * as React from "react";
import { connect } from "react-redux";
import { replace } from "react-router-redux";

import * as CancelableComponent from "../../components/CancelableComponent";
import IndexUtils from "../../index-utils";
import Source from "../../models/source";
import User from "../../models/user";
import { State } from "../../reducers";
import SourceService from "../../services/source";

/**
 * The params are generated by the React Router.  So a URL for this component would include:
 *
 * "/:id/:key"
 * or
 * "?id=<value>&key=<value>"
 */
interface Query {
    id?: string | undefined;
    key?: string | undefined;
}

interface Location {
    query: Query;
}

interface StateProps {
    currentUser: User;
}

interface DispatchProps {
    goTo: (url: string) => void;
}

interface StandardProps {
    location: Location;
}

interface CreateOrRouteProps extends StateProps, DispatchProps, StandardProps, CancelableComponent.PromiseComponentProps {
}

interface CreateOrRouteState extends CancelableComponent.PromiseComponentState {

}

function mapStateToProps(state: State.All): StateProps {
    return {
        currentUser: state.session.user
    };
}

function mapStateToDispatch(dispatch: any): DispatchProps {
    return {
        goTo: function (path: string) {
            return dispatch(replace(path));
        }
    };
}

function mergeRemainingProps(stateProps: StateProps, dispatchProps: DispatchProps, standardProps: StandardProps): CreateOrRouteProps {
    return { ...stateProps, ...dispatchProps, ...standardProps };
}

function checkParams(query: Query): Promise<Query> {
    const { id, key } = query;
    return new Promise(function (resolve: (id: Query) => void, reject: (err: Error) => void) {
        if (id && key) {
            resolve({ id: id, key: key });
        } else {
            reject(new Error("Both ID and Key must be provided."));
        }
    });
}

interface QueryResult {
    source: Source;
    query: Query;
}

function linkSource(query: Query, user: User): Promise<QueryResult> {
    const { id, key } = query;
    return SourceService.linkSource({ id: id, secretKey: key }, user)
        .then(function (result: SourceService.LinkResult) {
            return { source: result.source, query: query };
        });
}

function getSource(sources: Source[], query: Query): Promise<QueryResult> {
    return IndexUtils.findSource(sources, query.id)
        .then(function (source: Source) {
            return { source: source, query: query };
        });
}

function checkResult(result: QueryResult): string {
    const { source, query } = result;
    if (source.secretKey === query.key) {
        return query.id;
    } else {
        throw new Error("Keys do not match.");
    }
}

export class CreateOrRoute extends CancelableComponent.CancelableComponent<CreateOrRouteProps, CreateOrRouteState> {

    componentWillMount() {
        const { location, goTo } = this.props;
        const { id, key } = location.query;
        if (!id && !key) {
            // Params were not passed to us.  Just move on.
            goTo("/skills");
        } else {
            this.reroute(this.props);
        }
    }

    reroute(props: CreateOrRouteProps): Promise<any> {
        const { goTo, location, currentUser } = this.props;
        const query = location.query;

        const promise = checkParams(query)
            .then(function (query: Query) {
                return linkSource(query, currentUser)
                    .then(function(queryResult: QueryResult) {
                        // Re-query latest
                        return getSource([], query);
                    });
            }).catch(function (err: Error) {
                // Fallback.  Maybe we already own it.
                return getSource([], query);
            }).then(function (query: QueryResult) {
                return checkResult(query);
            }).then(function (id: string) {
                goTo("/skills/" + id);
            }).catch(function (err: Error) {
                goTo("/notFound");
            });
        return this.resolve(promise);
    }

    render() {
        return (<div />);
    }
}

export default connect(
    mapStateToProps,
    mapStateToDispatch,
    mergeRemainingProps)
    (CreateOrRoute);