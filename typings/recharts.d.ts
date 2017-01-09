
/**
 * Typings for https://github.com/recharts/recharts
 * Started from https://github.com/itchio/itch and a little help from dts-gen
 */
declare module "recharts" {
    import * as React from "react";

    export type DataType = any;

    export type Data = DataType[];

    export class ResponsiveContainer extends React.Component<ResponsiveContainerProps, any> { }

    export interface ResponsiveContainerProps {
        width?: string | number;
        height?: string | number;
    }

    export class AreaChart extends React.Component<AreaChartProps, any> { }

    export interface AreaChartProps {
        margin?: {
            top?: number;
            right?: number;
            left?: number;
            bottom?: number;
        }
        data: Data;
    }

    export class Area extends React.Component<AreaProps, any> { }

    export type AreaType = "monotone";

    export interface AreaProps {
        type?: AreaType;
        curve?: boolean;
        dot?: boolean;
        isAnimationActive?: false;
        dataKey?: string;
        fill?: string;
        fillOpacity?: number;
    }

    export type Layout = "horizontal" | "vertical";

    export type Orientation = "bottom" | "top";

    export type Scale = "auto" | "linear" | "pow" | "sqrt" | "log" | "identity" | "time" | "band" | "point" | "ordinal" | "quantile" | "quantize" | "utcTime" | "sequential" | "threshold" | Function;

    export type Margin = { bottom: number, left: number, right: number, top: number };

    export interface LineChartProps {
        layout?: Layout;
        width?: number;
        height?: number;
        data: Data;
        margin?: Margin
    }

    export class LineChart extends React.Component<LineChartProps, any> { }

    export type Dot = boolean | any | React.ReactElement<any> | Function;

    export interface LineProps {
        dataKey: string | number;
        dot?: Dot;
    }

    export class Line extends React.Component<any, any> {}

    export interface AxisProps {
        hide?: boolean;
        dataKey?: string | number;
        minTickGap?: number;
        tickCount?: number;
        ticks?: any[];
        // Not 100% on this one, could just be a number
        tickFormatter?: (tick: number | string) => string;
    }

    export interface XAxisProps extends AxisProps {
        xAxisId?: string | number;
    }

    export class XAxis extends React.Component<XAxisProps, any> {}

    export interface YAxisProps extends AxisProps {
        yAxisId?: string | number;
     }

    export class YAxis extends React.Component<YAxisProps, any> {}

    export interface CartesianGridProps { }

    export class CartesianGrid extends React.Component<CartesianGridProps, any> {}

    export interface TooltipProps {
        labelFormatter?: (tick: number | string) => string;
    }
    export class Tooltip extends React.Component<TooltipProps, any> {}

}