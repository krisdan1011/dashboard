import * as classNames from "classnames";

import MDLComponent from "./MDLComponent";

export interface LayoutProps {
    drawer?: boolean;
    header?: boolean;
};

export default class Layout extends MDLComponent<LayoutProps, any> {

    classes() {
        return classNames("mdl-layout mdl-js-layout", {
            "mdl-layout--fixed-drawer": this.props.drawer,
            "mdl-layout--fixed-header": this.props.header
        });
    }

    render() {
        return (
            <div className={this.classes()}>
                {this.props.children}
            </div>
        );
    }
}
