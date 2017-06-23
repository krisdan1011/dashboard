import * as React from "react";
import {connect} from "react-redux";

import {Button} from "react-toolbox/lib/button";
import Checkbox from "react-toolbox/lib/checkbox";
import Dropdown from "react-toolbox/lib/dropdown";
import Input from "react-toolbox/lib/input";
import "../../themes/listitem.scss";

import {CancelableComponent} from "../../components/CancelableComponent";
import {Cell, Grid} from "../../components/Grid";
import Source from "../../models/source";
import User from "../../models/user";
import {State} from "../../reducers";
import SourceService from "../../services/source";
import SpokesService from "../../services/spokes";
import Noop from "../../utils/Noop";
import IntegrationSpokesSwapper, {PAGE} from "./IntegrationSpokesSwapper";

const DropdownTheme = require("./themes/dropdown.scss");
const InputTheme = require("./themes/input.scss");
const CheckboxTheme = require("./themes/checkbox.scss");
const ButtonTheme = require("./themes/button.scss");

interface DropdownValue {
    value: PAGE;
    label: string;
}

interface Message {
    style?: React.CSSProperties;
    message?: string;
}

interface IntegrationSpokesGlobalStateProps {
    user: User;
}

interface IntegrationSpokesStandardProps {
    source: Source;
    onSpokesSaved?(): void;
}

interface IntegrationSpokesProps extends IntegrationSpokesGlobalStateProps, IntegrationSpokesStandardProps {
}

interface IntegrationSpokesState {
    showPage: PAGE;
    proxy: boolean;
    message?: Message;
    url?: string;
    lambdaARN?: string;
    awsAccessKey?: string;
    awsAccessKeyInput?: string;
    awsSecretKey?: string;
    awsSecretKeyInput?: string;
    sourceName: string;
    hideAdvanced: boolean;
    proxying: boolean;
    monitor: boolean;
    proxyUrl: string;
    credentialsChanged: boolean;
}

function mapStateToProps(state: State.All): IntegrationSpokesGlobalStateProps {
    return {
        user: state.session.user
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {/* nothing to match at the moment */};
}

function getResource(state: IntegrationSpokesState): SpokesService.HTTP | SpokesService.Lambda {
    if (state.showPage === "http") {
        return {url: state.proxying ? state.proxyUrl : state.url};
    } else if (state.showPage === "lambda") {
        return {awsAccessKey: state.awsAccessKey, awsSecretKey: state.awsSecretKey, lambdaARN: state.lambdaARN};
    }
}

function mergeProps(stateProps: IntegrationSpokesGlobalStateProps, dispatchProps: any, parentProps: IntegrationSpokesStandardProps): IntegrationSpokesProps {
    return {...parentProps, ...dispatchProps, ...stateProps};
}

export class IntegrationSpokes extends CancelableComponent<IntegrationSpokesProps, IntegrationSpokesState> {

    static defaultProps: IntegrationSpokesProps = {
        user: undefined,
        source: undefined,
        onSpokesSaved: Noop,
    };

    static PAGES: DropdownValue[] = [{value: "http", label: "HTTP"}, {value: "lambda", label: "Lambda"}];

    static DEFAULT_MESSAGE_STYLE: React.CSSProperties = {
        visibility: "hidden"
    };

    static STANDARD_MESSAGE_STYLE: React.CSSProperties = {
        color: "#000000"
    };

    static ERROR_MESSAGE_STYLE: React.CSSProperties = {
        ...IntegrationSpokes.STANDARD_MESSAGE_STYLE, ...{
            color: "#FF0000"
        }
    };

    constructor(props: IntegrationSpokesProps) {
        super(props);

        this.handleSourceSwap = this.handleSourceSwap.bind(this);
        this.handleProxyCheckChange = this.handleProxyCheckChange.bind(this);
        this.handleProxyingCheckChange = this.handleProxyingCheckChange.bind(this);
        this.handleMonitorCheckChange = this.handleMonitorCheckChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSwapperChange = this.handleSwapperChange.bind(this);
        this.handleSwapperFocus = this.handleSwapperFocus.bind(this);
        this.handleSourceNameChange = this.handleSourceNameChange.bind(this);
        this.handleShowAdvanced = this.handleShowAdvanced.bind(this);

        this.state = {
            showPage: IntegrationSpokes.PAGES[0].value,
            message: {style: IntegrationSpokes.DEFAULT_MESSAGE_STYLE, message: ""},
            proxy: false,
            sourceName: this.props && this.props.source && this.props.source.name || "",
            hideAdvanced: true,
            proxying: false,
            monitor: false,
            proxyUrl: "https://proxy.bespoken.tools",
            credentialsChanged: false,
        };
    }

    componentWillMount() {
        this.downloadSpoke();
    }

    handleSourceSwap(value: PAGE) {
        this.setState({showPage: value} as IntegrationSpokesState);
    }

    handleProxyCheckChange(value: boolean) {
        this.setState({proxy: value} as IntegrationSpokesState);
    }

    handleProxyingCheckChange(value: boolean) {
        this.setState({proxying: value} as IntegrationSpokesState);
    }

    handleMonitorCheckChange(value: boolean) {
        this.setState({monitor: value} as IntegrationSpokesState);
    }

    handleSourceNameChange(value: string) {
        this.setState({sourceName: value} as IntegrationSpokesState);
    }

    handleShowAdvanced(): any {
        this.setState({hideAdvanced: !this.state.hideAdvanced} as IntegrationSpokesState);
    }

    handleSwapperChange(key: "url" | "lambdaARN" | "awsAccessKeyInput" | "awsSecretKeyInput", value: string) {
        let newObj = {} as any;
        newObj[key] = value;
        if (key === "awsAccessKeyInput" || key === "awsSecretKeyInput") {
            this.setState({credentialsChanged: true} as IntegrationSpokesState);
        }
        this.setState(newObj);
    }

    handleSwapperFocus(key: any) {
        let newObj = {} as any;
        newObj[key] = "";
        key && this.setState(newObj);
    }

    async handleSave() {
        this.setState({
            message: {
                style: IntegrationSpokes.STANDARD_MESSAGE_STYLE,
                message: "Saving..."
            }
        } as IntegrationSpokesState);
        const {source: {name, secretKey, id, created, members}, user, onSpokesSaved} = this.props;
        const {proxy, showPage, credentialsChanged, url} = this.state;
        const source: Source = {id, name, secretKey, created, members};
        source.debug_enabled = !!this.state.proxy && !!this.state.proxying;
        source.monitoring_enabled = !!this.state.monitor;
        source.proxy_enabled = !!this.state.proxying;
        if (showPage === "http") {
            source.url = url;
            source.aws_secret_access_key = undefined;
            source.aws_access_key_id = undefined;
            source.lambda_arn = undefined;
        } else if (showPage === "lambda") {
            source.url = undefined;
            source.aws_secret_access_key = credentialsChanged ? this.state.awsSecretKeyInput : this.state.awsSecretKey;
            source.aws_access_key_id = credentialsChanged ? this.state.awsAccessKeyInput : this.state.awsAccessKey;
            source.lambda_arn = this.state.lambdaARN;
        }
        const resource = getResource(this.state);
        const spokeSaved = await SpokesService.savePipe(user, source, resource, proxy);
        if (spokeSaved && onSpokesSaved) onSpokesSaved();
        this.resolve(SourceService.updateSourceObj(source)
            .then(() => {
                return {style: IntegrationSpokes.STANDARD_MESSAGE_STYLE, message: "Settings have been saved."};
            }).catch(function (err: Error) {
                console.error(err);
                return {
                    style: IntegrationSpokes.ERROR_MESSAGE_STYLE,
                    message: "An error ocurred while trying to save the spoke."
                };
            }).then((message?: Message) => {
                this.setState({message: message} as IntegrationSpokesState);
            }));
    }

    downloadSpoke() {
        const {source} = this.props;

        source && this.resolve(SourceService.getSourceObj(source.id)
            .then((spoke: Source) => {
                const {monitoring_enabled, proxy_enabled, url} = spoke;
                const proxy = {proxy: spoke.debug_enabled};
                const httpObj = (url) ? {url} : {url: undefined};
                const lambdaObj = {
                    lambdaARN: spoke.lambda_arn,
                    awsAccessKey: spoke.aws_access_key_id,
                    awsSecretKey: spoke.aws_secret_access_key
                };
                const awsAccessKeyInput = obscureInput(lambdaObj.awsAccessKey);
                const awsSecretKeyInput = obscureInput(lambdaObj.awsSecretKey);
                const showPage = url ? "http" : lambdaObj.lambdaARN ? "lambda" : "http";
                this.setState({
                    ...proxy, ...httpObj, ...lambdaObj,
                    monitor: monitoring_enabled,
                    proxying: proxy_enabled,
                    awsAccessKeyInput,
                    awsSecretKeyInput,
                    showPage,
                } as IntegrationSpokesState);
            }));
    }

    render() {
        const {showPage, proxy, proxying, monitor, message, sourceName, hideAdvanced, awsSecretKey, awsAccessKey, credentialsChanged, proxyUrl, ...others} = this.state;
        let saveDisabled: boolean;
        switch (showPage) {
            case "http":
                saveDisabled = !validateUrl(others.url);
                break;
            case "lambda":
                saveDisabled = !(others.lambdaARN && awsAccessKey && awsSecretKey);
                break;
            default:
                // We're apparently on something we don't know exists so don't let them go further.
                saveDisabled = true;
        }

        return (
            <Grid>
                <Cell col={6}>
                    <Input label="Source Name" value={sourceName} onChange={this.handleSourceNameChange}/>
                </Cell>
                <Cell col={6}/>
                <Cell col={12}>
                    <p style={{margin: 0}}>To use monitoring and our proxying features, provide information about your
                        endpoint below:</p>
                </Cell>
                <Cell style={{marginTop: -10}} col={3}>
                    <Dropdown
                        theme={DropdownTheme}
                        source={IntegrationSpokes.PAGES}
                        value={showPage}
                        onChange={this.handleSourceSwap}
                    />
                </Cell>
                <Cell col={9}/>
                <Cell style={{marginTop: 15}} col={6}>
                    <IntegrationSpokesSwapper
                        theme={InputTheme}
                        showPage={showPage}
                        onChange={this.handleSwapperChange}
                        onFocus={this.handleSwapperFocus}
                        url={this.props.source && this.props.source.url}
                        {...others} />
                </Cell>
                <Cell col={6}/>
                <Cell col={3}>
                    <Checkbox
                        theme={CheckboxTheme}
                        label={"Enable Monitoring"}
                        checked={monitor}
                        onChange={this.handleMonitorCheckChange}/>
                </Cell>
                <Cell col={9}/>
                <Cell col={12}>
                    <p>“Enable Monitoring” will:</p>
                    <ol>
                        <li>Ping service at one-minute interval</li>
                        <li>Notify email address registered if the service does not respond</li>
                    </ol>
                </Cell>
                <Cell col={12}><Button style={{fontSize: 12}} label="Advanced" onClick={this.handleShowAdvanced}/></Cell>
                <Cell col={12} className={`collapse ${hideAdvanced ? "collapsed" : ""}`}>
                    <Grid>
                        <Cell col={3}>
                            <Checkbox
                                theme={CheckboxTheme}
                                label={"Enable Proxying"}
                                checked={proxying}
                                onChange={this.handleProxyingCheckChange}/>
                        </Cell>
                        <Cell col={9}/>
                        <Cell col={12}>
                            {   proxying &&
                                <p>{`Your proxy access point: https://${this.props && this.props.source && this.props.source.id}.bespoken.link
                          To configure with an Alexa Skill, directions are`} <a
                                    href="http://docs.bespoken.tools/en/latest/alexa_skills_kit_configuration/">here</a>
                                </p>
                            }
                        </Cell>
                        <Cell col={3}>
                            <Checkbox
                                theme={CheckboxTheme}
                                label={"Enable Live Debugging"}
                                disabled={!proxying}
                                checked={proxy}
                                onChange={this.handleProxyCheckChange}/>
                        </Cell>
                        <Cell col={9}/>
                        <Cell col={12}>
                            <p>“Enable Live Debugging” will:</p>
                            <ol>
                                <li>{`Direct the external endpoint (https://${this.props && this.props.source && this.props.source.id}.bespoken.link) to your local bst proxy`}</li>
                                <li>Requires that you start up bst with the `bst proxy` command</li>
                            </ol>
                        </Cell>
                    </Grid>
                </Cell>
                <Cell col={2}>
                    <Button
                        theme={ButtonTheme}
                        accent
                        raised
                        disabled={saveDisabled}
                        label="Save"
                        onClick={this.handleSave}/>
                    <p style={message.style}>{message.message}</p>
                </Cell>
                <Cell col={3}/>
            </Grid >
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(IntegrationSpokes);

function validateUrl(check?: string): boolean {
    // We're not going to go crazy here.
    const regex = /^(https?:\/\/).+/;
    return regex.test(check);
}

function obscureInput(value: string): string {
    const base: any = "*";
    return value ? base.repeat(value.length - 4) + value.slice(-4) : "";
}
