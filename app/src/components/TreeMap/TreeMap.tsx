import * as React from "react";
import * as ReactTransitionGroup from "react-addons-transition-group";

import NodeContainer from "../NodeContainer/NodeContainer";
import { Utils } from "../../utils/Utils";
import { format } from "d3-format";
import {
    TreemapLayout,
    treemap as d3treemap,
    hierarchy as d3hierarchy
} from "d3-hierarchy";
import {
    scaleLinear,
    scaleSequential,
    interpolateViridis
} from "d3-scale";
import { interpolateHcl } from "d3-interpolate";

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
        valueFormat: ",d",
        // These props will be passed from outer component if needed
        // bgColorRangeLow: "#007AFF",
        // bgColorRangeHigh: "#FFF500",
        colorText: "#000",
        borderColorHover: "#000"
    };

    // Numeric value format function
    private _valueFormatFunction: (n: number) => string;
    // Background Color function
    private _nodesbgColorFunction: (t: number) => string;

    private _treemap: TreemapLayout<{}>;
    private _x: any;
    private _y: any;

    constructor(props: ITreeMapProps, context: any) {
        super(props, context);

        // Default State values
        this.state = {
            scopedData: this.props.data,
            height: this.props.height,
            width: this.props.width
        };



        this._valueFormatFunction = format(this.props.valueFormat);

        // Create bgColorFunction
        if (props.hasOwnProperty("bgColorRangeLow")
            && props.hasOwnProperty("bgColorRangeHigh")) {
            this._nodesbgColorFunction = scaleLinear<any>()
                .domain([0, Utils.getDepth(this.props.data) - 1])
                .interpolate(interpolateHcl)
                .range([props.bgColorRangeLow, props.bgColorRangeHigh]);
        } else {
            this._nodesbgColorFunction = scaleSequential(interpolateViridis)
                .domain([-4, 4]);
        }

    }


    public render() {
        console.log("TreeMap. Render.");

        const { valueFormat, colorText, borderColorHover } = this.props;
        const { width, height } = this.state;

        this._x = scaleLinear().range([0, width]);
        this._y = scaleLinear().range([0, height]);

        // 1. Create treemap structure
        this._treemap = d3treemap()
            .size([width, height])
            .paddingOuter(3)
            .paddingTop(19)
            .paddingInner(1)
            .round(true);

        // 2. Before compute a hierarchical layout, we need a root node
        //    If the data is in JSON we use d3.hierarchy
        const root = d3hierarchy(this.state.scopedData)
            .sum((d: any) => d.value)
            .sort((a, b) => b.height - a.height || b.value - a.value);

        // Get array of nodes
        const nodes = this._treemap(root)
            .descendants();

        const reactNodes = nodes.map((node, idx) => {
            const name = (node as any).data.name;
            const hasChildren = node.children && node.children.length > 0 ? true : false;
            const backgroundColor = this._nodesbgColorFunction(node.depth);
            const value = this._valueFormatFunction(node.value);
            return (
                <NodeContainer
                    key={idx}
                    x0={node.x0}
                    y0={node.y0}
                    x1={node.x1}
                    y1={node.y1}
                    bgColor={backgroundColor}
                    bgOpacity="1"
                    borderColorHover={borderColorHover}
                    id={idx}
                    label={name}
                    name={name}
                    fontSize={"14px"}
                    textColor={colorText}
                    className="node"
                    depth={node.depth}
                    hasChildren={hasChildren}
                    value={value}
                    hoverAnimation={true}
                    onClick={this._onNodeClick}
                />
            );
        });

        let transform = `translate(${120}, ${50})`;
        return (
            <svg
                className="treemap__Container"
                height={height}
                width={width}
                transform={transform}
            >
                <ReactTransitionGroup component="g">
                    {reactNodes}
                </ReactTransitionGroup>
            </svg>
        );
    }

    // private zoom(d: any) {
    //     const kx = this.state.width / d.dx;
    //     const ky = this.state.height / d.dy;
    //     this._x.domain([d.x, d.x + d.dx]);
    //     this._x.domain([d.y, d.y + d.dy]);

    //     var t = svg.selectAll("g.cell").transition()
    //         .duration(750)
    //         .attr("transform", (d: any) => {
    //             return "translate(" + this._x(d.x) + "," + this._y(d.y) + ")";
    //         });

    //     t.select("rect")
    //         .attr("width", function (d) { return kx * d.dx - 1; })
    //         .attr("height", function (d) { return ky * d.dy - 1; })

    //     t.select("text")
    //         .attr("x", function (d) { return kx * d.dx / 2; })
    //         .attr("y", function (d) { return ky * d.dy / 2; })
    //         .style("opacity", function (d) { return kx * d.dx > d.w ? 1 : 0; });

    //     node = d;
    //     d3.event.stopPropagation();
    // }


    private _onNodeClick = (e: any) => {
        console.log(e);
        // this.setState({scopedData:{}});
        // this.setState({
        //     height: 900,
        //     width: 1200
        // });
    }

}
export default TreeMap;
