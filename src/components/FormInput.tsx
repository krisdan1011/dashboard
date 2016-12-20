import * as classNames from "classnames";
import * as objectAssign from "object-assign";
import * as React from "react";

import StringUtil from "../utils/string";
import MDLComponent from "./MDLComponent";
import Pill from "./Pill";

/**
 * Class that can be included to display custom messages to the user based on the input.
 */
export interface ErrorHandler {
    /**
     * The regex to set to the form to check against.  An undefined means that any text will be accepted.
     */
    regex: RegExp;
    /**
     * If the input doesn't match the input prodided, this method will be called to retrieve the error message to display to the user.
     *
     * @param input
     *      The input that the user has shown.
     *
     */
    errorMessage: (input: string) => string | undefined;
}

interface FormInputTheme {
    inputTextColor: string;
} ;

interface FormInputProps {
    theme?: FormInputTheme;
    label: string;
    type: "text" | "password";
    value: string;
    autoFocus?: boolean;
    floatingLabel?: boolean;
    onChange?: (event: React.FormEvent) => any;
    style?: React.CSSProperties;
    readOnly?: boolean;
    autoComplete?: "off" | "on" ;
    hidden?: boolean;
    error?: ErrorHandler;
    showable?: boolean;
}

interface FormState {
    errorMsg?: string;
    show: boolean;
}

export class FormInput extends MDLComponent<FormInputProps, FormState> {

    constructor(props: FormInputProps) {
        super(props);
        this.state = {
            errorMsg: undefined,
            show: false
        };
    }

    classes() {
        return classNames("mdl-textfield mdl-js-textfield", {
            "mdl-textfield--floating-label": this.props.floatingLabel
        });
    }

    inputStyle(): React.CSSProperties {
        return objectAssign({}, {color: this.props.theme ? this.props.theme.inputTextColor : undefined});
    }

    onFormChange(event: React.FormEvent) {
        let errorMsg: string = undefined;
        let target = event.target as HTMLSelectElement;
        if (this.props.error !== undefined) {
            errorMsg = this.props.error.errorMessage(target.value);
        }

        this.state.errorMsg = errorMsg;
        this.setState(this.state);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    }

    onShow(event: React.MouseEvent) {
        this.setState(function(previousState) {
            return {
                errorMsg: previousState.errorMsg,
                show: true
            };
        });
    }

    render() {
        let pattern: string = undefined;
        if (this.props.error !== undefined) {
            pattern = this.props.error.regex.source;
        }

        let autoFocus: boolean = this.props.autoFocus || false;
        return (
            <div
                className={this.classes()}
                style={this.props.style}
                hidden={this.props.hidden}>
                <input
                    autoFocus={autoFocus}
                    autoComplete={this.props.autoComplete ? this.props.autoComplete : "off"}
                    className="mdl-textfield__input"
                    type={this.state.show ? "text" : this.props.type}
                    id={StringUtil.stringToCamelCase(this.props.label)}
                    value={this.props.value}
                    pattern={pattern}
                    onChange={this.onFormChange.bind(this)}
                    readOnly={this.props.readOnly}
                    style={this.inputStyle()}/>
                { this.props.showable && !this.state.show ? (
                    <Pill onClick={this.onShow.bind(this)} style={{ position: "absolute", "right": "0px", top:"20px", padding:"2px", lineHeight:"12px"}}> show </Pill>
                ) : undefined }
                <label
                    className="mdl-textfield__label"
                    htmlFor={StringUtil.stringToCamelCase(this.props.label)}>
                    {this.props.label}
                </label>
                <span className="mdl-textfield__error">{this.state.errorMsg}</span>
            </div>
        );
    }
}

export default FormInput;