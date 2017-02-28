import * as React from "react";
import { connect } from "react-redux";

import { findLatest, nextPage, PageResults, retrieveLogs } from "../../actions/log";
import Conversation from "../../models/conversation";
import ConversationList from "../../models/conversation-list";
import Log from "../../models/log";
import LogQuery from "../../models/log-query";
import Source from "../../models/source";
import { State } from "../../reducers";
import { LogQueryEvent } from "../../reducers/log";
import SourceUtil from "../../utils/Source";
import { DateFilter } from "./filters/ConvoFilters";
import { CompositeFilter } from "./filters/Filters";
import ConvoList from "./list/FilterableConvoList";

const LIMIT: number = 50;

interface DateRange {
    startTime?: Date;
    endTime?: Date;
}

interface ConvoListPageStateProps {
    isLoading: boolean;
    source: Source;
}

interface ConvoListPageReduxProps {
    getLogs: (query: LogQuery) => Promise<Log[]>;
    newPage: (logQueryEvent: LogQueryEvent, limit: number) => Promise<PageResults>;
    refresh: (logQueryEvent: LogQueryEvent) => Promise<PageResults>;
}

interface ConvoListPageStandardProps {
    filter?: CompositeFilter<Conversation>;
    iconStyle?: React.CSSProperties;
    iconTooltip?: string;
    onItemClick?: (conversation: Conversation) => void;
    onIconClick?: (conversation: Conversation) => void;
}

interface ConvoListPageProps extends ConvoListPageStateProps, ConvoListPageReduxProps, ConvoListPageStandardProps {
}

interface ConvoListPageState {
    query: LogQuery;
    lastLogs: Log[];
    conversations: ConversationList;
    hasInitial: boolean;
    endReached: boolean;
}

function mapStateToProps(state: State.All): ConvoListPageStateProps {
    return {
        isLoading: state.log.isLoading,
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>): ConvoListPageReduxProps {
    return {
        getLogs: function (query: LogQuery): Promise<Log[]> {
            const fetchLogs = retrieveLogs(query, false);
            return fetchLogs(dispatch);
        },
        newPage: function (query: LogQueryEvent, limit: number): Promise<PageResults> {
            const fetchLogs = nextPage(query, limit);
            return fetchLogs(dispatch);
        },
        refresh: function (query: LogQueryEvent): Promise<PageResults> {
            const fetchLogs = findLatest(query);
            return fetchLogs(dispatch);
        }
    };
}

function mergeProps(stateProps: ConvoListPageStateProps, dispatchProps: ConvoListPageReduxProps, parentProps: ConvoListPageStandardProps): ConvoListPageProps {
    return { ...parentProps, ...dispatchProps, ...stateProps };
}

function getDateRange(filter: CompositeFilter<any>): DateRange {
    let range: DateRange = {};
    const dateFilter = (filter) ? filter.getFilter(DateFilter.type) as DateFilter : undefined;
    if (dateFilter) {
        range = { ...{ startTime: dateFilter.startDate, endTime: dateFilter.endDate } };
    }
    return range;
}

export class ConvoListPage extends React.Component<ConvoListPageProps, ConvoListPageState> {

    constructor(props: ConvoListPageProps) {
        super(props);

        this.handleItemsFiltered = this.handleItemsFiltered.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

        this.state = {
            conversations: [],
            lastLogs: [],
            endReached: false,
            hasInitial: false,
            query: undefined
        };
    }

    componentWillReceiveProps(nextProps: ConvoListPageProps, context: any) {
        if (nextProps.source) {
            if (!SourceUtil.equals(nextProps.source, this.props.source) || !this.state.hasInitial) {
                const range = getDateRange(this.props.filter);
                const query: LogQuery = new LogQuery({
                    source: nextProps.source,
                    startTime: range.startTime,
                    endTime: range.endTime,
                    limit: 50
                });

                nextProps.getLogs(query)
                    .then((logs: Log[]) => {
                        const conversations = ConversationList.fromLogs(logs);
                        this.setState({ conversations: conversations, query: query, lastLogs: logs, endReached: false, hasInitial: true });
                    });
            }
        } else if (this.props.source) {
            // We're going from defined to undefined. Clear everything.
            this.setState({ conversations: [], query: undefined, lastLogs: [], endReached: true, hasInitial: false });
        }
    }

    handleItemsFiltered(shownItems: ConversationList) {
        if (!this.props.isLoading && !this.state.endReached && shownItems.length < LIMIT) {
            this.getNextPage();
        }
    }

    handleScroll(firstVisibleIndex: number, lastVisibleIndex: number, totalCount: number) {
        if (!this.props.isLoading && !this.state.endReached && totalCount - lastVisibleIndex < 5) {
            this.getNextPage();
        }
    }

    getNextPage() {
        this.props.newPage({ query: this.state.query, logs: this.state.lastLogs }, 50)
            .then((result: PageResults) => {
                const endReached = result.newLogs.length === 0;
                if (!endReached) {
                    // The reason we can't just append right now is because we may have partial conversations from the previous batch.
                    const newConversations = ConversationList.fromLogs(result.totalLogs);
                    this.state.conversations = newConversations;
                    this.state.lastLogs = result.totalLogs;
                }
                this.state.endReached = endReached;
                this.setState(this.state);
            });
    }

    getRefresh() {
        this.props.refresh({ query: this.state.query, logs: this.state.lastLogs })
            .then((result: PageResults) => {
                if (result.newLogs.length > 0) {
                    // The reason we can't just preppend right now is because we may have partial conversations from the previous batch.
                    const newConversations = ConversationList.fromLogs(result.totalLogs);
                    this.state.conversations = this.state.conversations.concat(newConversations);
                    this.state.lastLogs = result.totalLogs;
                    this.setState(this.state);
                }
            });
    }

    render() {
        let { ...others } = this.props;
        return (
            <ConvoList
                {...others}
                onScroll={this.handleScroll}
                onItemsFiltered={this.handleItemsFiltered}
                conversations={this.state.conversations}
            />
        );
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(ConvoListPage);