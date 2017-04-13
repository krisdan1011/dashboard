import * as moment from "moment";
import * as React from "react";

import { Cell, Grid } from "../../components/Grid";
import Source from "../../models/source";
import { AMAZON_ORANGE, BLACK, GOOGLE_GREEN } from "../../utils/colors";
import SourceIntentSummary, { BarProps } from "./SourceIntentSummary";
import SourceOriginSelector, { SourceOption } from "./SourceOriginSelector";
import SourceStats from "./SourceStats";
import SourceTimeSummary, { LineProps } from "./SourceTimeSummary";

const AllCheckboxTheme = require("./themes/checkbox-all-theme.scss");
const AmazonCheckboxTheme = require("./themes/checkbox-amazon-theme.scss");
const GoogleCheckboxTheme = require("./themes/checkbox-google-theme.scss");

// corresponds with the stat entry on SourceStats.
type SelectedStatEntry = "stats" | "Amazon.Alexa" | "Google.Home" | "Unknown";

// The entry corresponds with the label for easy pickens.
type LabelMap<T> = {
    [label: string]: T;
};

interface SourceFullSummaryProps {
    header: string;
    source: Source;
    startDate: moment.Moment;
    endDate: moment.Moment;
}

interface SourceFullSummaryState {
    selectedStatEntry: SelectedStatEntry[];
    sourceOptions: SourceOption[];
    lines: LineProps[];
    bars: BarProps[];
}

function values<T>(obj: LabelMap<T>): T[] {
    return Object.keys(obj).map(function (key) { return obj[key]; });
}

export class SourceFullSummary extends React.Component<SourceFullSummaryProps, SourceFullSummaryState> {
    static options: LabelMap<SourceOption> = {
        "Total": {
            label: "Total",
            theme: AllCheckboxTheme,
            checked: true
        },
        "Amazon": {
            label: "Amazon",
            theme: AmazonCheckboxTheme,
            checked: true
        },
        "Google": {
            label: "Google",
            theme: GoogleCheckboxTheme,
            checked: true
        }
    };

    static lines: LabelMap<LineProps> = {
        "Total": {
            dataKey: "total",
            name: "Total",
            stroke: BLACK
        },
        "Amazon": {
            dataKey: "Amazon.Alexa",
            name: "Alexa",
            stroke: AMAZON_ORANGE
        },
        "Google": {
            dataKey: "Google.Home",
            name: "Home",
            stroke: GOOGLE_GREEN
        }
    };

    static bars: LabelMap<BarProps> = {
        "Amazon": {
            dataKey: "Amazon.Alexa",
            name: "Alexa",
            fill: AMAZON_ORANGE,
            stackId: "a"
        },
        "Google": {
            dataKey: "Google.Home",
            name: "Home",
            fill: GOOGLE_GREEN,
            stackId: "a"
        }
    };

    static statEntries: LabelMap<SelectedStatEntry> = {
        "Total": "stats",
        "Amazon": "Amazon.Alexa",
        "Google": "Google.Home"
    };

    constructor(props: SourceFullSummaryProps) {
        super(props);

        this.handleOriginChange = this.handleOriginChange.bind(this);

        this.state = {
            sourceOptions: values(SourceFullSummary.options),
            lines: values(SourceFullSummary.lines),
            bars: values(SourceFullSummary.bars),
            selectedStatEntry: [SourceFullSummary.statEntries["Total"]]
        };
    }

    handleOriginChange(index: number, label: string, checked: boolean) {
        let totalChecked: boolean = false;

        this.state.sourceOptions[index].checked = checked;
        this.state.lines = [];
        this.state.bars = [];
        this.state.selectedStatEntry = [];

        for (let o of this.state.sourceOptions) {
            if (o.checked) {
                this.state.selectedStatEntry.push(SourceFullSummary.statEntries[o.label]);
                this.state.lines.push(SourceFullSummary.lines[o.label]);
                if (o.label !== "Total") {
                    this.state.bars.push(SourceFullSummary.bars[o.label]);
                } else {
                    totalChecked = o.checked;
                }
            }
        }

        // We don't care what's check for stat entry if "Total" is selected.
        if (totalChecked) {
            this.state.selectedStatEntry = [SourceFullSummary.statEntries["Total"]];
        }

        this.setState(this.state);
    }

    render() {
        const { header, ...others } = this.props;
        const { bars, lines, selectedStatEntry } = this.state;
        const options = SourceFullSummary.options;
        const handleOriginChange = this.handleOriginChange;

        return (
            <div>
                <Grid>
                    <h4>{header}</h4>
                </Grid>

                <span>
                    <SourceOriginSelector
                        options={values(options)}
                        onCheck={handleOriginChange} />
                    <SourceStats
                        selectedEntries={selectedStatEntry}
                        {...others} />
                    <Grid>
                        <Cell col={12} style={{ height: 300 }}>
                            <SourceTimeSummary
                                {...others}
                                lines={lines} />
                        </Cell>
                    </Grid>
                    <Grid>
                        <Cell col={12} >
                            <SourceIntentSummary
                                {...others}
                                bars={bars} />
                        </Cell>
                    </Grid>
                </span>
            </div>
        );
    }
}

export default SourceFullSummary;