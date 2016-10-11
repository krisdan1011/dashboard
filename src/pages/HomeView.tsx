﻿
import * as React from "react";

import Hello from "../components/Hello";

export default class HomeView extends React.Component<any, any> {

    render() {
        return (
            <div>
                <h2>Home</h2>
                <Hello name="world" />
            </div>
        );
    }
};

