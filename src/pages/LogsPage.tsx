import * as React from "react";
import { connect } from "react-redux";

import { getLogs } from "../actions/log";
import { ConversationList } from "../components/ConversationList";
import { Cell, Grid } from "../components/Grid";
import { OutputList } from "../components/OutputList";
import Conversation from "../models/conversation";
import Log from "../models/log";
import Output from "../models/output";
import Source from "../models/source";
import { State } from "../reducers";
import Interaction from "./Interaction";

interface LogsPageProps {
    logs: Log[];
    source: Source;
    getLogs: (source: string) => (dispatch: Redux.Dispatch<any>) => void;
    params?: any;
}

interface LogsPageState {
    source: Source | undefined;
    request: Log | undefined;
    response: Log | undefined;
    outputs: Output[] | undefined;
}

function mapStateToProps(state: State.All) {
    return {
        logs: state.log.logs,
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        getLogs: function (source: string) {
            dispatch(getLogs(source));
        }
    };
}

export class LogsPage extends React.Component<LogsPageProps, LogsPageState> {

    constructor(props: LogsPageProps) {
        super(props);
        this.state = {
            source: props.source,
            request: undefined,
            response: undefined,
            outputs: []
        };
    }

    setCurrentSourceFromSources(source: Source) {
        if (source) {
            this.props.getLogs(source.secretKey);
            this.setState({
                source: source,
                request: this.state.request,
                response: this.state.response,
                outputs: this.state.outputs
            });
        }
    }

    componentWillReceiveProps(nextProps: LogsPageProps, nextContext: any): void {
        if (this.state.source === undefined) {
            this.setCurrentSourceFromSources(nextProps.source);
        }
    }

    onConversationClicked(conversation: Conversation, event: React.MouseEvent) {
        this.setState({
            source: this.state.source,
            request: conversation.request,
            response: conversation.response,
            outputs: conversation.outputs
        });
    }

    shouldExpandNode(keyName: string[], data: any, level: number) {
        // only expand the initial node, request and response by default
        if (keyName.length === 0 || keyName.indexOf("request") > -1 || keyName.indexOf("response") > -1) {
            return true;
        }
        return false;
    }

    getContentHeight() {
        if (document.getElementsByClassName !== undefined) {
            let mains = document.getElementsByClassName("mdl-layout__content");
            if (mains.length > 0) {
                let main: Element = mains.item(0);
                return main.clientHeight;
            }
        }
        // Return default height, this is when the page isn't fully rendered
        //  or when we are unit testing
        return 200;
    }

    render() {
        return (
            <Grid>
                <Cell col={6}>
                    <h6>CONVERSATIONS</h6>
                    <div style={{ maxHeight: this.getContentHeight() - 90, overflowY: "scroll" }}>
                        <ConversationList
                            logs={this.props.logs}
                            onClick={this.onConversationClicked.bind(this)} />
                    </div>
                </Cell>
                <Cell col={6} style={{ maxHeight: this.getContentHeight() - 30, overflowY: "scroll" }}>
                    <Interaction
                        request={this.state.request}
                        response={this.state.response}/>
                </Cell>
            </Grid>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsPage);