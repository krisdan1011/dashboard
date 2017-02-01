import * as classNames from "classnames";
import * as React from "react";
import Checkbox from "react-toolbox/lib/checkbox";
import DatePicker from "react-toolbox/lib/date_picker";
import Dropdown from "react-toolbox/lib/dropdown";
import Input from "react-toolbox/lib/input";

import { Cell, Grid } from "../../../components/Grid";
import LogQuery from "../../../models/log-query";
import { DateFilter, ExceptionFilter, IntentFilter, LogLevelFilter, RequestFilter } from "../Filters";

const FilterBarStyle = require("./style.scss");
const DatePickerFilterbarTheme = require("../../../themes/datepicker-filterbar.scss");
const DropdownFilterbarTheme = require("../../../themes/dropdown-filterbar.scss");
const InputTheme = require("../../../themes/input-light.scss");
const CheckboxTheme = require("../../../themes/checkbox-light.scss");

export interface FilterProps {
    query: LogQuery;
    onFilterLogLevel: (filter: LogLevelFilter) => void;
    onFilterRequest: (filter: RequestFilter) => void;
    onFilterIntent: (filter: IntentFilter) => void;
    onFilterDate: (filter: DateFilter) => void;
    onFilterException: (filter: ExceptionFilter) => void;
    className?: string;
}

export interface FilterState {
    startDate?: Date;
    endDate?: Date;
    logTypes?: LogType[];
    selectedType?: string;
    requestvalue?: string;
    intentValue?: string;
    exceptionsOnly?: boolean;
    filterMap: any;
    filterbarHidden: boolean;
}

interface LogType {
    value: string;
    label: string;
}

class FilterBar extends React.Component<FilterProps, FilterState> {

    handleStartDateChange: Function;
    handleEndDateChange: Function;

    constructor(props: FilterProps) {
        super(props);

        let types: LogType[] = [];
        types.push({ value: "", label: "All Logs" });
        types.push({ value: "DEBUG", label: "Debug" });
        types.push({ value: "INFO", label: "Info" });
        types.push({ value: "WARN", label: "Warning" });
        types.push({ value: "ERROR", label: "Error" });

        this.state = {
            filterMap: {},
            selectedType: types[0].value,
            logTypes: types,
            filterbarHidden: false,
            startDate: props.query ? props.query.startTime : undefined,
            endDate: props.query ? props.query.endTime : undefined
        };

        this.handleStartDateChange = this.handleDateChange.bind(this, "startDate");
        this.handleEndDateChange = this.handleDateChange.bind(this, "endDate");
        this.handleExceptionOnlyChange = this.handleExceptionOnlyChange.bind(this);
        this.handleLogTypeChange = this.handleLogTypeChange.bind(this);
        this.handleIntentChange = this.handleIntentChange.bind(this);
        this.handleRequestChange = this.handleRequestChange.bind(this);
    }

    gridClasses() {
        return classNames(FilterBarStyle.filterBarGrid, this.props.className);
    }

    componentWillReceiveProps(nextProps: FilterProps) {
        // currently not letting the caller override state if it changed.
        // TODO: It would be preferable to allow this or get rid of query.
        if (!this.state.endDate && nextProps.query) {
            this.setDateRange(nextProps.query.startTime, nextProps.query.endTime);
        }
    }

    setDateRange(startDate: Date, endDate: Date) {
        this.state.startDate = (startDate) ? new Date(startDate) : undefined;
        if (this.state.startDate) {
            this.state.startDate.setHours(0, 0, 0, 0);
        }

        this.state.endDate = (endDate) ? new Date(endDate) : undefined;
        if (this.state.endDate) {
            this.state.endDate.setHours(23, 59, 59, 999);
        }
        this.setState(this.state);
    }

    handleDateChange(item: "startDate" | "endDate", value: Date) {

        if (item === "startDate") {
            this.setDateRange(value, this.state.endDate);
        } else if (item === "endDate") {
            this.setDateRange(this.state.startDate, value);
        }

        this.props.onFilterDate(new DateFilter(this.state.startDate, this.state.endDate));
    }

    handleLogTypeChange(value: string) {
        this.state.selectedType = value;
        this.setState(this.state);
        this.props.onFilterLogLevel(new LogLevelFilter(value));
    }

    handleRequestChange(value: string) {
        this.state.requestvalue = value;
        this.setState(this.state);
        this.props.onFilterRequest(new RequestFilter(value));
    }

    handleIntentChange(value: string) {
        this.state.intentValue = value;
        this.setState(this.state);
        this.props.onFilterIntent(new IntentFilter(value));
    }

    handleExceptionOnlyChange(value: boolean) {
        this.state.exceptionsOnly = value;
        this.setState(this.state);

        let filter: ExceptionFilter = (value) ? new ExceptionFilter() : new FakeExceptionFilter();
        this.props.onFilterException(filter);
    }

    render(): JSX.Element {
        let fullEndDate = new Date();
        let queryEndDate = this.state.endDate ? this.state.endDate : fullEndDate;

        return (
            <Grid className={this.gridClasses()} >
                <Cell col={2} tablet={3} phone={2}>
                    <Dropdown
                        theme={DropdownFilterbarTheme}
                        label="Log Level"
                        auto={false}
                        onChange={this.handleLogTypeChange}
                        source={this.state.logTypes}
                        value={this.state.selectedType}
                    />
                </Cell>
                <Cell col={1} offsetDesktop={0} tablet={3} offsetTablet={0} phone={2} offsetPhone={0} >
                    <Input
                        theme={InputTheme}
                        type="text"
                        label="Request Type"
                        name="Request Type"
                        value={this.state.requestvalue}
                        onChange={this.handleRequestChange} />
                </Cell>
                <p style={{ color: "rgb(255, 255, 255)", fontSize: "26px", margin: "auto -5px", marginTop: "28px", display: "inline-block" }}>.</p>
                <Cell col={1} offsetDesktop={0} tablet={3} offsetTablet={0} phone={2} offsetPhone={0} >
                    <Input
                        theme={InputTheme}
                        type="text"
                        label="Intent"
                        name="Intent"
                        value={this.state.intentValue}
                        onChange={this.handleIntentChange} />
                </Cell>
                <Cell col={1} offsetDesktop={0} tablet={1} offsetTablet={0} phone={4} offsetPhone={0}>
                    <div style={{ position: "relative", top: "50%", transform: "translate(0%, -50%)" }} >
                        <Checkbox
                            theme={CheckboxTheme}
                            checked={this.state.exceptionsOnly}
                            label="With Exceptions"
                            onChange={this.handleExceptionOnlyChange} />
                    </div>
                </Cell>
                <Cell col={2} offsetDesktop={3} tablet={4} offsetTablet={0} phone={2} offsetPhone={0}>
                    <DatePicker
                        theme={DatePickerFilterbarTheme}
                        label="Start Date"
                        maxDate={queryEndDate}
                        value={this.state.startDate}
                        onChange={this.handleStartDateChange}
                        readonly={this.props.query ? false : true} />
                </Cell>
                <p style={{ color: "rgb(255, 255, 255)", fontSize: "26px", margin: "auto -5px", marginTop: "28px", display: "inline-block" }}>-</p>
                <Cell col={2} offsetDesktop={0} tablet={4} offsetTablet={0} phone={1} offsetPhone={0}>
                    <DatePicker
                        theme={DatePickerFilterbarTheme}
                        label="End Date"
                        minDate={this.state.startDate}
                        maxDate={fullEndDate}
                        value={this.state.endDate}
                        onChange={this.handleEndDateChange}
                        readonly={this.props.query ? false : true} />
                </Cell>
            </Grid>
        );
    }
}

export default FilterBar;

class FakeExceptionFilter extends ExceptionFilter {

    get filter(): (item: any) => boolean {
        return function (item: any): boolean {
            return true;
        };
    }
}