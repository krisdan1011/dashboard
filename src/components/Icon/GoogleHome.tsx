import * as React from "react";

import { IconButton } from "react-toolbox/lib/button";

interface GoogleHomeProps {
    style?: React.CSSProperties;
    width?: string;
    height?: string;
    color?: string;
    onClick?: () => void;
}

export default class GoogleHome extends React.Component<GoogleHomeProps, any> {
    static defaultProps: GoogleHomeProps = {
        style: {
            fontSize: "1rem",
            width: "3em",
            height: "3em"
        },
        width: "58px",
        height: "88px",
        color: "#FFFFFF"
    };

    constructor(props: GoogleHomeProps) {
        super(props);
    }

    render() {
        return (
            <IconButton
                onClick={this.props.onClick}
                icon={<Icon
                    {...this.props.style}/>} />
        );
    }
}
class Icon extends React.Component<GoogleHomeProps, any> {


    // tslint:disable
    render() {
        return (
            <svg style={this.props.style} onClick={this.props.onClick} width={this.props.width} height={this.props.height} viewBox="0 0 58 88" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <path d="M28.671,83.913 L28.671,83.913 L28.667,83.913 C10.825,83.913 6.367,81.388 6.187,81.28 C6.135,81.248 6.089,81.207 6.053,81.16 C3.8,78.224 0.02,72.159 0.02,64.507 C0.02,62.002 0.219,57.391 0.611,50.805 C0.624,50.58 0.774,50.357 0.996,50.325 C1.211,50.293 1.402,50.375 1.484,50.569 C1.766,50.838 4.99,53.273 28.541,53.273 C52.302,53.273 55.597,50.796 55.867,50.549 C55.964,50.365 56.153,50.295 56.359,50.336 C56.572,50.377 56.712,50.589 56.723,50.805 C57.117,57.393 57.315,62.002 57.315,64.507 C57.315,72.159 53.536,78.225 51.282,81.16 C51.246,81.207 51.201,81.248 51.148,81.28 C50.967,81.388 46.51,83.913 28.671,83.913 L28.671,83.913 Z" id="path-1"></path>
                    <mask id="mask-2" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="57.295" height="33.5947424" fill="white">
                        <use xlinkHref="#path-1"></use>
                    </mask>
                </defs>
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="simple_home">
                        <g id="noun_679288">
                            <path d="M28.54,54.222 C18,54.222 9.888,53.715 5.081,52.757 C1.502,52.043 0.806,51.291 0.678,51.078 C0.628,50.997 0.605,50.901 0.611,50.805 C1.211,40.722 2.141,27.995 2.82,18.701 C3.232,13.065 3.347,13.678 3.419,12.256 C3.432,11.994 3.651,11.791 3.918,11.805 C4.18,11.818 4.381,12.041 4.369,12.303 C4.297,13.736 4.196,12.907 3.768,18.771 C3.095,27.993 2.173,40.598 1.573,50.639 C1.871,50.852 2.894,51.406 5.959,51.955 C10.836,52.829 18.435,53.272 28.541,53.272 C38.701,53.272 46.362,52.823 51.314,51.94 C54.378,51.396 55.442,50.845 55.762,50.627 C55.161,40.59 54.241,27.992 53.567,18.774 C53.137,12.909 52.648,6.831 52.576,5.398 C52.564,5.136 52.765,4.913 53.027,4.9 C53.292,4.885 53.51,5.088 53.525,5.35 C53.595,6.773 54.102,13.066 54.515,18.704 C55.194,27.996 56.123,40.723 56.723,50.805 C56.729,50.909 56.7,51.015 56.642,51.102 C56.42,51.422 53.767,54.222 28.54,54.222 Z" id="Shape" fill="#000000" fillRule="nonzero"></path>
                            <g id="Group" transform="translate(5.000000, 80.000000)" fillRule="nonzero" fill="#000000">
                                <path d="M23.668,6.678 C34.508,6.678 40.91,5.914 43.293,3.791 C43.767,3.371 44.758,2.366 45.906,0.872 C45.906,0.872 41.583,3.438 23.667,3.438 L23.667,3.438 C5.751,3.438 1.43,0.872 1.43,0.872 C2.576,2.366 3.569,3.371 4.041,3.791 C6.424,5.914 12.828,6.678 23.668,6.678 L23.668,6.678 Z" id="Shape"></path>
                                <path d="M23.668,7.152 C12.057,7.152 6.093,6.255 3.726,4.146 C3.145,3.628 2.138,2.573 1.053,1.16 C0.915,0.979 0.924,0.726 1.075,0.555 C1.226,0.386 1.477,0.348 1.672,0.463 C1.713,0.487 6.208,2.964 23.668,2.964 C41.13,2.964 45.624,0.487 45.666,0.461 C45.863,0.348 46.113,0.389 46.262,0.559 C46.411,0.73 46.421,0.98 46.283,1.161 C45.2,2.574 44.192,3.63 43.612,4.147 C41.242,6.255 35.279,7.152 23.668,7.152 Z M2.922,1.948 C3.691,2.829 4.225,3.319 4.357,3.438 C6.505,5.35 12.461,6.203 23.667,6.203 L23.668,6.203 C34.874,6.203 40.828,5.35 42.979,3.438 C43.11,3.319 43.644,2.829 44.414,1.948 C41.823,2.73 35.881,3.913 23.668,3.913 C11.456,3.913 5.514,2.73 2.922,1.948 Z" id="Shape"></path>
                            </g>
                            <path d="M28.457,16.109 C21.853,17.063 15.64,17.246 10.961,16.625 C4.727,15.798 3.418,13.893 3.418,12.441 C3.418,10.989 4.728,8.707 10.961,6.077 C15.64,4.103 21.854,2.491 28.457,1.536 C35.06,0.582 41.272,0.398 45.954,1.019 C52.187,1.847 53.495,3.751 53.495,5.203 C53.495,6.655 52.187,8.938 45.954,11.568 C41.272,13.541 35.06,15.154 28.457,16.109 Z M28.457,2.485 C14.048,4.568 4.368,9.243 4.368,12.303 C4.368,15.364 14.048,17.241 28.457,15.159 C42.866,13.076 52.546,8.401 52.546,5.34 C52.546,2.28 42.866,0.402 28.457,2.485 Z" id="Shape" fill="#000000" fillRule="nonzero"></path>
                            <path d="M28.671,83.913 L28.671,83.913 L28.667,83.913 C10.825,83.913 6.367,81.388 6.187,81.28 C6.135,81.248 6.089,81.207 6.053,81.16 C3.8,78.224 0.02,72.159 0.02,64.507 C0.02,62.002 0.219,57.391 0.611,50.805 C0.624,50.58 0.774,50.357 0.996,50.325 C1.211,50.293 1.402,50.375 1.484,50.569 C1.766,50.838 4.99,53.273 28.541,53.273 C52.302,53.273 55.597,50.796 55.867,50.549 C55.964,50.365 56.153,50.295 56.359,50.336 C56.572,50.377 56.712,50.589 56.723,50.805 C57.117,57.393 57.315,62.002 57.315,64.507 C57.315,72.159 53.536,78.225 51.282,81.16 C51.246,81.207 51.201,81.248 51.148,81.28 C50.967,81.388 46.51,83.913 28.671,83.913 L28.671,83.913 Z" id="Base-Background" fill={this.props.color} fillRule="nonzero"></path>
                            <use id="Base" stroke="#000000" mask="url(#mask-2)" strokeWidth="2" fillRule="nonzero" xlinkHref="#path-1"></use>
                            <g id="Group" transform="translate(20.000000, 8.000000)" fillRule="nonzero" fill="#000000">
                                <ellipse id="Oval" transform="translate(2.110041, 0.892819) rotate(-8.852886) translate(-2.110041, -0.892819) " cx="2.1100413" cy="0.702823075" rx="1.49101999" ry="0.310004157"></ellipse>
                                <path d="M1.238,1.275 L1.238,1.275 C0.708,1.275 0.456,1.179 0.422,0.964 C0.354,0.52 1.505,0.292 2.004,0.214 C2.333,0.163 2.651,0.135 2.923,0.135 C3.453,0.135 3.705,0.231 3.738,0.447 C3.806,0.89 2.655,1.118 2.156,1.197 C1.827,1.248 1.508,1.275 1.238,1.275 Z M0.925,0.885 C0.997,0.895 1.098,0.903 1.237,0.903 L1.237,0.903 C1.489,0.903 1.787,0.878 2.098,0.829 C2.654,0.743 3.036,0.619 3.233,0.527 C3.029,0.499 2.541,0.509 2.059,0.584 C1.504,0.67 1.123,0.793 0.925,0.885 Z" id="Shape"></path>
                            </g>
                            <g id="Group" transform="translate(28.000000, 6.000000)" fillRule="nonzero" fill="#000000">
                                <ellipse id="Oval" transform="translate(2.499168, 1.213320) rotate(-8.852886) translate(-2.499168, -1.213320) " cx="2.49916802" cy="1.02332422" rx="1.49202001" ry="0.310004157"></ellipse>
                                <path d="M1.627,1.597 L1.627,1.597 C1.097,1.597 0.845,1.501 0.811,1.286 C0.742,0.843 1.894,0.614 2.393,0.537 C2.722,0.486 3.04,0.458 3.312,0.458 C3.844,0.458 4.094,0.554 4.126,0.77 C4.196,1.213 3.044,1.441 2.546,1.52 C2.216,1.57 1.898,1.597 1.627,1.597 Z M1.314,1.207 C1.386,1.217 1.487,1.225 1.626,1.225 L1.626,1.225 C1.878,1.225 2.177,1.199 2.487,1.151 C3.044,1.064 3.425,0.941 3.623,0.849 C3.419,0.821 2.931,0.831 2.448,0.906 C1.894,0.992 1.511,1.115 1.314,1.207 Z" id="Shape"></path>
                            </g>
                            <g id="Group" transform="translate(23.000000, 9.000000)" fillRule="nonzero" fill="#000000">
                                <ellipse id="Oval" transform="translate(2.339523, 1.260178) rotate(-8.841563) translate(-2.339523, -1.260178) " cx="2.33952347" cy="1.07017277" rx="1.49197411" ry="0.309994621"></ellipse>
                                <path d="M1.469,1.643 L1.469,1.643 C0.939,1.643 0.688,1.547 0.654,1.331 C0.585,0.888 1.737,0.66 2.236,0.581 C2.566,0.53 2.883,0.503 3.155,0.503 C3.686,0.503 3.937,0.599 3.971,0.814 C4.039,1.258 2.888,1.486 2.389,1.564 C2.058,1.615 1.74,1.643 1.469,1.643 Z M1.156,1.252 C1.229,1.261 1.329,1.27 1.468,1.27 L1.468,1.27 C1.72,1.27 2.018,1.244 2.329,1.195 C2.886,1.109 3.268,0.986 3.465,0.893 C3.259,0.865 2.773,0.874 2.291,0.95 C1.736,1.037 1.354,1.16 1.156,1.252 Z" id="Shape"></path>
                            </g>
                            <g id="Group" transform="translate(32.000000, 7.000000)" fillRule="nonzero" fill="#000000">
                                <ellipse id="Oval" transform="translate(1.729212, 1.581656) rotate(-8.852886) translate(-1.729212, -1.581656) " cx="1.72921242" cy="1.39165986" rx="1.49101999" ry="0.310004157"></ellipse>
                                <path d="M0.857,1.965 L0.857,1.965 C0.327,1.965 0.076,1.869 0.042,1.653 C-0.025,1.209 1.125,0.982 1.623,0.903 C1.952,0.852 2.269,0.825 2.544,0.825 C3.074,0.825 3.324,0.921 3.359,1.136 C3.426,1.58 2.275,1.807 1.777,1.886 C1.447,1.937 1.128,1.965 0.857,1.965 Z M0.546,1.575 C0.618,1.584 0.719,1.592 0.858,1.592 L0.858,1.592 C1.111,1.592 1.409,1.566 1.72,1.518 C2.276,1.432 2.658,1.309 2.856,1.216 C2.652,1.188 2.163,1.198 1.682,1.273 C1.125,1.359 0.742,1.482 0.546,1.575 Z" id="Shape"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}
// tslint:enable