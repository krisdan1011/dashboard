export interface Members {
    [userId: string]: string;
}

export interface SourceProperties {
    name: string;
    secretKey?: string;
    members?: Members;
    id?: string;
    created?: Date | string;
    url?: string;
    lambda_arn?: string;
    aws_access_key_id?: string;
    aws_secret_access_key?: string;
    monitoring_enabled?: boolean;
    proxy_enabled?: boolean;
    debug_enabled?: boolean;
}

export class Source implements SourceProperties {

    readonly secretKey: string | undefined;
    readonly name: string;
    readonly members: Members;
    readonly id: string | undefined;
    readonly created: string | undefined; // Firebase requires a "string" so this must be kept as a string.
    public url?: string | undefined;
    public lambda_arn?: string | undefined;
    public aws_access_key_id?: string | undefined;
    public aws_secret_access_key?: string | undefined;
    public monitoring_enabled?: boolean | undefined;
    public proxy_enabled?: boolean | undefined;
    public debug_enabled?: boolean | undefined;

    constructor(props: SourceProperties) {

        this.name = props.name;
        this.id = props.id;
        this.members = props.members ? { ...props.members } : {};
        this.secretKey = props.secretKey;
        this.url = props.url;
        this.lambda_arn = props.lambda_arn;
        this.aws_access_key_id = props.aws_access_key_id;
        this.aws_secret_access_key = props.aws_secret_access_key;
        this.monitoring_enabled = props.monitoring_enabled;
        this.proxy_enabled = props.proxy_enabled;
        this.debug_enabled = props.debug_enabled;
        if (props.created) {
            if (props.created instanceof Date) {
                this.created = props.created.toISOString();
            } else if (typeof props.created  === "string") {
                this.created = new Date(props.created).toISOString();
            }
        }
    }
}

export default Source;
