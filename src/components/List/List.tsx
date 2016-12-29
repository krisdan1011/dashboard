import * as React from "react";

import { List } from "react-toolbox/lib/list";

import { Dimensions, Measure } from "../Measure";

let ReactList = require("react-list");

export interface ListProps {
    itemRenderer: (index: number, key: string) => JSX.Element;
    length: number;
    type: string;
}

interface ListState {
    dimens: Dimensions;
}

/**
 * A list that measures out it's own height so it does not stretch beyond the visible area.
 * Items will not render beyond the visible height until the user scrolls to them. This prevents, say,
 * a thousand items being rendered all at once.
 *
 * The ItemRenderer should return a ListItem component.
 */
class StaticList extends React.Component<ListProps, ListState> {

    constructor(props: ListProps) {
        super(props);
        this.state = {
            dimens: undefined
        };
    }

    updateDimensions(dimensions: Dimensions) {
        this.state.dimens = dimensions;
        this.setState(this.state);
    }

    render(): JSX.Element {
        let parentStyle = (this.state.dimens) ? { overflowY: "scroll", height: this.state.dimens.height } : {};

        // This is crazy, but there's a reason for now.
        // "List" is part of the React-Toolbox which provides styling for the list and list items.
        // "ReactList" is an internal element that provides infinite scrolling so that all the elements aren't loaded instantly.
        // They are two separate but similarly name libraries patched together.

        return (
            <Measure
                onMeasure={this.updateDimensions.bind(this)} >
                <div style={parentStyle}>
                    <List selectable ripple>
                    <ReactList
                        itemRenderer={this.props.itemRenderer}
                        length={this.props.length}
                        type={this.props.type} />
                    </List>
                </div>
            </Measure>
        );
    }
}

export default StaticList;