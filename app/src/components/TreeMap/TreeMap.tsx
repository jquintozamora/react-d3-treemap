import * as React from "react";
import NodeContainer from "../NodeContainer/NodeContainer";
import { Utils } from "../../utils/Utils";
import { format } from "d3-format";
import {
    treemap as d3treemap,
    hierarchy as d3hierarchy
} from "d3-hierarchy";
import {
    scaleSequential,
    scaleLinear,
    interpolateViridis,
    interpolateCool,
    interpolateCubehelixDefault
} from "d3-scale";
import { interpolateRgb, interpolateHcl } from "d3-interpolate";
import { rgb } from "d3-color";

/* tslint:disable:no-var-requires */
const styles: any = require("./TreeMap.module.css");
/* tslint:enable:no-var-requires */


import { ITreeMapProps } from "./ITreeMapProps";
import { ITreeMapState } from "./ITreeMapState";

class TreeMap extends React.Component<ITreeMapProps, ITreeMapState> {

    // Default Props values
    public static defaultProps: ITreeMapProps = {
        data: null,
        height: 600,
        width: 600,
        valueFormat: ",d"
    };

    // Internal property to store the value format function
    private _valueFormatFunction: (n: number) => string;
    // Internal property to store the value format function
    private _nodesBackgroundColorFunction: (t: number) => string;

    constructor(props: any, context: any) {
        super(props, context);

        // Default State values
        this.state = {
            scopedData: this.props.data,
            height: this.props.height,
            width: this.props.width
        };

        this._valueFormatFunction = format(this.props.valueFormat);
        this._nodesBackgroundColorFunction = scaleSequential(interpolateViridis)
            .domain([-4, 4]);

            // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/8941
            // http://bl.ocks.org/jfreyre/b1882159636cc9e1283a
        var colorScale = scaleLinear<string>()
            .domain([-1, 5])
            .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
            .interpolate(interpolateHcl);

        // this._nodesBackgroundColorFunction = scaleLinear<string>()
        //     .domain([1, 100])
        //     .interpolate(interpolateHcl)
        //     .range(["#007AFF", '#FFF500']);
        ;
        //.domain([1, 20])
        //.interpolate(interpolateRgb)
        //.range(["#007AFF", '#FFF500']); //interpolateHsl interpolateHcl interpolateRgb
        //.domain([1, 100])
        //.interpolate(interpolateHcl)
        //.range([rgb("#007AFF"), rgb('#FFF500')]);

    }


    public render() {
        console.log("TreeMap. Render");

        const { valueFormat } = this.props;
        const { width, height } = this.state;

        // var color = d3.scaleMagma()


        // 1. Create treemap structure
        const treemap = d3treemap()
            .size([width, height])
            .paddingOuter(3)
            .paddingTop(19)
            .paddingInner(1)
            .round(true);

        // 2. Before compute a hierarchical layout, we need a root node
        //      If the data is in JSON we use d3.hierarchy
        //      If the data is in flat CSV we can use d3.stratify
        // const root = d3.hierarchy(data, (d: any) => { return d && d.map((item: any) => {return { item: item, my: "hi"}; });});
        const root = d3hierarchy(this.state.scopedData)
            .sum((d: any) => d.value)
            .sort((a, b) => b.height - a.height || b.value - a.value);

        // Get array of nodes
        const nodes = treemap(root).descendants();

        const reactNodes = nodes.map((node, idx) => {
            const name = (node as any).data.name;
            const hasChildren = node.children && node.children.length > 0 ? true : false;
            return (
                <NodeContainer
                    key={idx}
                    x0={node.x0}
                    y0={node.y0}
                    x1={node.x1}
                    y1={node.y1}
                    backgroundColor={this._nodesBackgroundColorFunction(node.depth)}
                    rectStroke={"transparent"}
                    id={idx}
                    label={name}
                    name={name}
                    fontSize={"14px"}
                    textColor={"white"}
                    className="node"
                    depth={node.depth}
                    hasChildren={hasChildren}
                    value={this._valueFormatFunction(node.value)}
                    hoverAnimation={true}
                    onClick={this._onNodeClick}
                />
            );
        });

        return (
            <svg
                className="treemap__Container"
                height={height}
                width={width}
            >
                {reactNodes}
            </svg>
        );
    }

    private _onNodeClick = (e: any) => {
        console.log(e);
        // this.setState({scopedData:{}});
    }

}
export default TreeMap;
