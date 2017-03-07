import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { replace, RouterAction } from "react-router-redux";

import { Button } from "react-toolbox/lib/button";
import Dialog from "react-toolbox/lib/dialog";

import { deleteSource } from "../actions/source";
import DataTile from "../components/DataTile";
import BarChart, { CountData } from "../components/Graphs/Bar/CountChart";
import TimeChart, { LineProps, TimeData } from "../components/Graphs/Line/TimeChart";
import { Cell, Grid } from "../components/Grid";
import Query, { EndTimeParameter, FillGapsParameter, GranularityParameter, SortParameter, SourceParameter, StartTimeParameter } from "../models/query";
import Source from "../models/source";
import { State } from "../reducers";
import LogService from "../services/log";

const DeleteButtonTheme = require("../themes/button_theme.scss");
const DeleteDialogTheme = require("../themes/dialog_theme.scss");

enum DataState {
    LOADING, ERROR, LOADED
}

class PageTimeData extends TimeData {
    total?: number;
    "amazon.alexa"?: number;
    "google.home"?: number;

    constructor(time: Date | moment.Moment) {
        super(time);
    }
}

interface SourcePageProps {
    source: Source;
    goHome: () => RouterAction;
    removeSource: (source: Source) => Promise<Source>;
}

interface SourcePageState {
    timeSummaryData: PageTimeData[];
    intentSummaryData: CountData[];
    sourceStats: LogService.SourceStats;
    timeLoaded: DataState;
    intentLoaded: DataState;
    statsLoaded: DataState;
    deleteDialogActive: boolean;
}

function mapStateToProps(state: State.All) {
    return {
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        goHome: function (): RouterAction {
            return dispatch(replace("/"));
        },
        removeSource: function (source: Source): Promise<Source> {
            return dispatch(deleteSource(source));
        }
    };
}

class TimeSortParameter extends SortParameter {
    parameter = "date_sort";
}

class IntentSortParameter extends SortParameter {
    parameter = "count_sort";
}

export class SourcePage extends React.Component<SourcePageProps, SourcePageState> {

    dialogActions: any[];

    constructor(props: SourcePageProps) {
        super(props);
        this.handleDeleteDialogToggle = this.handleDeleteDialogToggle.bind(this);
        this.handleDeleteSkill = this.handleDeleteSkill.bind(this);

        this.dialogActions = [{
            label: "Cancel",
            onClick: this.handleDeleteDialogToggle
        }, {
            label: "Delete",
            onClick: this.handleDeleteSkill
        }];

        this.state = {
            timeSummaryData: defaultPageTimeData(daysAgo(7), daysAgo(0)),
            intentSummaryData: defaultIntentData(),
            timeLoaded: DataState.LOADING,
            intentLoaded: DataState.LOADING,
            statsLoaded: DataState.LOADING,
            deleteDialogActive: false,
            sourceStats: {
                source: "",
                stats: {
                    totalEvents: 0,
                    totalExceptions: 0,
                    totalUsers: 0
                }
            }
        };
    }

    componentWillReceiveProps(nextProps: SourcePageProps, context: any) {
        if (!this.props.source || !nextProps.source || this.props.source.id !== nextProps.source.id) {
            this.retrieveTimeSummary(nextProps.source);
            this.retrieveIntentSummary(nextProps.source);
            this.retrieveSourceStats(nextProps.source);
        }
    }

    componentDidMount() {
        if (this.props.source) {
            this.retrieveTimeSummary(this.props.source);
            this.retrieveIntentSummary(this.props.source);
            this.retrieveSourceStats(this.props.source);
        }
    }

    retrieveTimeSummary(source: Source) {
        const dataLoader: DataLoader<LogService.TimeSummary, PageTimeData[]> = {
            loadData: function (query: Query): Promise<LogService.TimeSummary> {
                return LogService.getTimeSummary(query);
            },
            map: function (data: LogService.TimeSummary): any[] {
                const mergedData = merge(data);
                return mergedData;
            },
        };

        const callback: GenericStateHandler<PageTimeData[]> = new GenericStateHandler(this.state, "timeLoaded", "timeSummaryData", this.setState.bind(this));
        const onLoaded = callback.onLoaded.bind(callback);
        callback.onLoaded = function (data: PageTimeData[]) {
            if (data.length === 0) {
                data = defaultPageTimeData(daysAgo(7), daysAgo(0));
            }
            onLoaded(data);
        };
        const loader: Loader = new Loader(dataLoader, callback, callback);

        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new StartTimeParameter(daysAgo(7)));
        query.add(new EndTimeParameter(daysAgo(0)));
        query.add(new GranularityParameter("hour"));
        query.add(new TimeSortParameter("asc"));
        query.add(new FillGapsParameter(true));

        loader.load(query);
    }

    retrieveIntentSummary(source: Source) {
        const dataLoader: DataLoader<LogService.IntentSummary, CountData[]> = {
            loadData: function (query: Query): Promise<LogService.IntentSummary> {
                return LogService.getIntentSummary(query);
            },
            map: function (data: LogService.IntentSummary): CountData[] {
                return data.count
                    .map(function (value: LogService.IntentBucket, index: number, array: LogService.IntentBucket[]) {
                        let intentData: CountData = {
                            count: value.count,
                            title: value.name
                        };
                        return intentData;
                    });
            }
        };

        const callback: GenericStateHandler<PageTimeData> = new GenericStateHandler(this.state, "intentLoaded", "intentSummaryData", this.setState.bind(this));
        const loader: Loader = new Loader(dataLoader, callback, callback);

        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new StartTimeParameter(daysAgo(7)));
        query.add(new EndTimeParameter(daysAgo(0)));
        query.add(new IntentSortParameter("desc"));

        loader.load(query);
    }

    retrieveSourceStats(source: Source) {
        const dataLoader: DataLoader<LogService.SourceStats, LogService.SourceStats> = {
            loadData: function (query: Query): Promise<LogService.SourceStats> {
                return LogService.getSourceSummary(query);
            },
            map: function (data: LogService.SourceStats): LogService.SourceStats {
                return data;
            }
        };

        const callback: GenericStateHandler<PageTimeData> = new GenericStateHandler(this.state, "statsLoaded", "sourceStats", this.setState.bind(this));
        const loader: Loader = new Loader(dataLoader, callback, callback);

        const query: Query = new Query();
        query.add(new SourceParameter(source));
        query.add(new StartTimeParameter(daysAgo(7)));
        query.add(new EndTimeParameter(daysAgo(0)));

        loader.load(query);
    }

    handleDeleteDialogToggle() {
        this.state.deleteDialogActive = !this.state.deleteDialogActive;
        this.setState(this.state);
    }

    handleDeleteSkill(): Promise<Source> {
        const goBack = this.props.goHome;
        const source = this.props.source;
        return this.props.removeSource(source)
            .then(function (source: Source) {
                goBack();
                return source;
            }).catch(function (e: Error) {
                console.error(e);
                return source;
            });
    }

    render() {
        const tileColor = "#ECEFF1";
        const sourceName = (this.props.source) ? this.props.source.name : "this skill";
        return (
            <span>
                {this.props.source ? (
                    <span>
                        <Grid style={{ backgroundColor: "rgb(36, 48, 54)", paddingBottom: "0px", paddingTop: "0px" }}>
                            <Cell col={3} hidePhone={true}>
                                <DataTile
                                    theme={{ inputTextColor: tileColor, bottomBorderColor: tileColor }}
                                    value={this.props.source.name}
                                    label={"Name"} />
                            </Cell>
                            <Cell col={3} hidePhone={true} >
                                <DataTile
                                    theme={{ inputTextColor: tileColor, bottomBorderColor: tileColor }}
                                    value={this.props.source.id}
                                    label={"ID"} />
                            </Cell>
                            <Cell col={3} hidePhone={true} >
                                <DataTile
                                    theme={{ inputTextColor: tileColor, bottomBorderColor: tileColor }}
                                    value={moment(this.props.source.created).format("MMM Do, YYYY")}
                                    label={"Created"} />
                            </Cell>
                            <Cell col={3} hidePhone={true} >
                                <DataTile
                                    theme={{ inputTextColor: tileColor, bottomBorderColor: tileColor }}
                                    value={this.props.source.secretKey}
                                    label={"Secret Key"}
                                    hidden={true}
                                    showable={true} />
                            </Cell>
                        </Grid>
                    </span>
                ) : undefined}
                <SummaryView
                    PageTimeData={this.state.timeSummaryData}
                    intentData={this.state.intentSummaryData}
                    totalEvents={this.state.sourceStats.stats.totalEvents}
                    totalUniqueUsers={this.state.sourceStats.stats.totalUsers}
                    totalExceptions={this.state.sourceStats.stats.totalExceptions}
                    timeLoaded={this.state.timeLoaded}
                    intentLoaded={this.state.intentLoaded}
                    statsLoaded={this.state.statsLoaded} />

                <Grid>
                    <Cell>
                        <Button
                            theme={DeleteButtonTheme}
                            raised
                            primary
                            onClick={this.handleDeleteDialogToggle}
                            label="Delete Skill" />
                    </Cell>
                </Grid>

                <Dialog
                    theme={DeleteDialogTheme}
                    actions={this.dialogActions}
                    active={this.state.deleteDialogActive}
                    onEscKeyDown={this.handleDeleteDialogToggle}
                    onOverlayClick={this.handleDeleteDialogToggle}
                    title="Delete Skill" >
                    <p>Are you sure you want to delete {sourceName}? This action can not be undone.</p>
                </Dialog>
            </span>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SourcePage);

interface SummaryViewProps {
    PageTimeData: PageTimeData[];
    intentData: CountData[];
    totalEvents: number;
    totalUniqueUsers: number;
    totalExceptions: number;
    timeLoaded: DataState;
    intentLoaded: DataState;
    statsLoaded: DataState;
}

interface SummaryDataState {
    eventsLabel: string;
    usersLabel: string;
    errorsLabel: string;
}

class SummaryView extends React.Component<SummaryViewProps, SummaryDataState> {

    static lines: LineProps[] = [{
        dataKey: "amazon.alexa",
        name: "Alexa",
        stroke: "#FF9900"
    }, {
        dataKey: "google.home",
        name: "Home",
        stroke: "#4885ed"
    }, {
        dataKey: "total",
        name: "Total",
        stroke: "#000000"
    }];

    constructor(props: SummaryViewProps) {
        super(props);
        this.state = {
            eventsLabel: "",
            usersLabel: "",
            errorsLabel: ""
        };
        this.setLabels(props, this.state);
    }

    componentWillReceiveProps(nextProps: SummaryViewProps, context: any) {
        this.setLabels(nextProps, this.state);
        this.setState(this.state);
    }

    setLabels(props: SummaryViewProps, state: SummaryDataState) {
        if (props.statsLoaded === DataState.LOADING) {
            this.state = {
                eventsLabel: "Loading...",
                usersLabel: "Loading...",
                errorsLabel: "Loading..."
            };
        } else if (props.statsLoaded === DataState.ERROR) {
            this.state = {
                eventsLabel: "N/A",
                usersLabel: "N/A",
                errorsLabel: "N/A"
            };
        } else {
            this.state = {
                eventsLabel: props.totalEvents.toString(),
                usersLabel: props.totalUniqueUsers.toString(),
                errorsLabel: props.totalExceptions.toString()
            };
        }
    }

    render() {
        let summary: JSX.Element;
        summary = (
            <span>
                <Grid>
                    <Cell col={4}>
                        <DataTile
                            value={this.state.eventsLabel}
                            label={"Total Events"} />
                    </Cell>
                    <Cell col={4}>
                        <DataTile
                            value={this.state.usersLabel}
                            label={"Unique Users"} />
                    </Cell>
                    <Cell col={4}>
                        <DataTile
                            value={this.state.errorsLabel}
                            label={"Total Errors"} />
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={12} style={{ height: 300 }}>
                        <TimeChart
                            data={this.props.PageTimeData}
                            lines={SummaryView.lines} />
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={12} style={{ height: (this.props.intentData.length * 40) + 100 }} >
                        <BarChart
                            data={this.props.intentData} />
                    </Cell>
                </Grid>
            </span>
        );

        return (
            <div>
                <Grid>
                    <h4> Last Seven Day Summary </h4>
                </Grid>
                {summary}
            </div>
        );
    }
}

function defaultPageTimeData(start: Date, end: Date): PageTimeData[] {
    let data: PageTimeData[] = [];
    let currentDate: Date = new Date(start);
    while (currentDate.getDate() < end.getDate()) {
        const newData: PageTimeData = new PageTimeData(currentDate);
        newData.total = 0;
        newData["amazon.alexa"] = 0;
        newData["google.home"] = 0;
        data.push(newData);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
}

function daysAgo(days: number) {
    const date: Date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

function defaultIntentData(): CountData[] {
    const data: CountData[] = [];
    return data;
}

interface DataLoader<ServerData, ClientData> {
    loadData: (query: Query) => Promise<ServerData>;
    map: (data: ServerData) => ClientData;
}

interface LoadCallback<ClientData> {
    onLoaded: (data: ClientData) => void;
    onError: (err: Error) => void;
}

interface StateHandler {
    stateChange: (state: DataState) => void;
}

class GenericStateHandler<Data> implements StateHandler, LoadCallback<Data> {
    readonly dataStateVariable: string;
    readonly dataVariable: string;
    readonly setState: (state: any) => void;
    state: any;

    constructor(state: any, dataStateVarable: string, dataVariable: string, setState: (state: any) => void) {
        this.dataVariable = dataVariable;
        this.dataStateVariable = dataStateVarable;
        this.state = state;
        this.setState = setState;
    }

    stateChange(state: DataState) {
        this.state[this.dataStateVariable] = state;
        this.setState(this.state);
    }

    onLoaded(data: Data) {
        this.state[this.dataVariable] = data;
        this.setState(this.state);
    }

    onError(err: Error) {
        // Error is caught in the state change. Nothing we need to do.
    }
}

class Loader {
    dataLoader: DataLoader<any, any>;
    stateHandler: StateHandler;
    loadCallback: LoadCallback<any>;

    constructor(dataLoader: DataLoader<any, any>, stateHandler: StateHandler, loadCallback: LoadCallback<any>) {
        this.dataLoader = dataLoader;
        this.stateHandler = stateHandler;
        this.loadCallback = loadCallback;
    }

    load(query: Query) {
        this.stateHandler.stateChange(DataState.LOADED);
        this.dataLoader.loadData(query).then((value: any) => {
            const loadedData: any = this.dataLoader.map(value);
            this.stateHandler.stateChange(DataState.LOADED);
            this.loadCallback.onLoaded(loadedData);
        }).catch((err: Error) => {
            console.error(err);
            this.stateHandler.stateChange(DataState.ERROR);
            this.loadCallback.onError(err);
        });
    }
}

function merge(summary: LogService.TimeSummary): PageTimeData[] {
    const merger: any = {};
    for (let bucket of summary.buckets) {
        const date = new Date(bucket.date);
        date.setMinutes(0, 0, 0);
        const dateString = date.toISOString();
        const newObj: PageTimeData = new PageTimeData(date);
        newObj["total"] = bucket.count;
        newObj["amazon.alexa"] = 0;
        newObj["google.home"] = 0;
        merger[dateString] = newObj;
    }

    join(merger, summary.amazonBuckets, "amazon.alexa");
    join(merger, summary.googleBuckets, "google.home");

    const values = Object.keys(merger).map(key => merger[key]);
    return values;
}

function join(merger: any, buckets: LogService.TimeBucket[], key: "total" | "amazon.alexa" | "google.home") {
    for (let bucket of buckets) {
        const date = new Date(bucket.date);
        date.setMinutes(0, 0, 0);
        const dateString = date.toISOString();
        let obj: PageTimeData = merger[dateString];
        if (!obj) {
            obj = new PageTimeData(date);
            obj["total"] = bucket.count;
            obj["amazon.alexa"] = 0;
            obj["google.home"] = 0;
        }
        obj[key] = bucket.count;
        merger[dateString] = obj;
    }
}