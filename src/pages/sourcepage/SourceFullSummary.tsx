import * as React from "react";

import { Cell, Grid } from "../../components/Grid";
import Source from "../../models/source";
import SourceIntentSummary from "./SourceIntentSummary";
import SourceOriginSelector, { SourceOption } from "./SourceOriginSelector";
import SourceStats from "./SourceStats";
import SourceTimeSummary from "./SourceTimeSummary";

const AllCheckboxTheme = require("./themes/checkbox-all-theme.scss");
const AmazonCheckboxTheme = require("./themes/checkbox-amazon-theme.scss");
const GoogleCheckboxTheme = require("./themes/checkbox-google-theme.scss");

interface SourceFullSummaryProps {
    header: string;
    source: Source;
    startDate: moment.Moment;
    endDate: moment.Moment;
}

interface SourceFullSummaryState {
    sourceOptions: SourceOption[];
}

export class SourceFullSummary extends React.Component<SourceFullSummaryProps, SourceFullSummaryState> {
    static options: SourceOption[] = [{
        label: "All",
        theme: AllCheckboxTheme,
        checked: true
    }, {
        label: "Amazon",
        theme: AmazonCheckboxTheme,
        checked: true
    }, {
        label: "Google",
        theme: GoogleCheckboxTheme,
        checked: true
    }];

    constructor(props: SourceFullSummaryProps) {
        super(props);

        this.handleOriginChange = this.handleOriginChange.bind(this);

        this.state = {
            sourceOptions: SourceFullSummary.options.slice()
        };
    }

    handleOriginChange(index: number, label: string) {
        this.state.sourceOptions[index].checked = !this.state.sourceOptions[index].checked;
        this.setState(this.state);
    }

    render() {
        const { header, source, startDate, endDate } = this.props;
        const options = SourceFullSummary.options;
        return (
            <div>
                <Grid>
                    <h4>{header}</h4>
                </Grid>

                <span>
                    <SourceOriginSelector
                        options={options} />
                    <SourceStats
                        source={source}
                        startDate={startDate}
                        endDate={endDate} />
                    <Grid>
                        <Cell col={12} style={{ height: 300 }}>
                            <SourceTimeSummary
                                source={source}
                                startDate={startDate}
                                endDate={endDate} />
                        </Cell>
                    </Grid>
                    <Grid>
                        <Cell col={12} >
                            <SourceIntentSummary
                                source={source}
                                startDate={startDate}
                                endDate={endDate} />
                        </Cell>
                    </Grid>
                </span>
            </div>
        );
    }
}

export default SourceFullSummary;