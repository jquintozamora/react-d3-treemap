import * as React from "react";
import { Utils } from "../../utils/Utils";

import * as d3 from "d3-hierarchy";
import { format } from "d3-format";
import { scaleSequential, interpolateMagma } from "d3-scale";
// import { rgb } from "d3-color";

/* tslint:disable:no-var-requires */
const styles: any = require("./TreeMap.module.css");
/* tslint:enable:no-var-requires */

import { data } from "../../data/data";
import NodeContainer from "../NodeContainer/NodeContainer";

import { ITreeMapProps } from "./ITreeMapProps";
import { ITreeMapState } from "./ITreeMapState";

class TreeMap extends React.Component<ITreeMapProps, ITreeMapState> {

    constructor(props: any, context: any) {
        super(props, context);

        // Default State values
        this.state = {
            scopedData: data
        };
    }

    public render() {

        // Tree map based on d3:
        // https://bl.ocks.org/mbostock/911ad09bdead40ec0061
        // https://bl.ocks.org/mbostock/f85ffb3a5ac518598043
        // CLickable: https://bl.ocks.org/mbostock/8fe6fa6ed1fa976e5dd76cfa4d816fec
        // Other react projects:
        // https://github.com/yang-wei/rd3/blob/master/src/treemap/Treemap.jsx

        const width = 1600,
            height = 900;

        const formatConst = format(",d");
        // var color = d3.scaleMagma()
        var color = scaleSequential(interpolateMagma)
            .domain([-4, 4]);


        // 1. Create treemap structure
        const treemap = d3.treemap()
            .size([width, height])
            .paddingOuter(3)
            .paddingTop(19)
            .paddingInner(1)
            .round(true);

        // 2. Before compute a hierarchical layout, we need a root node
        //      If the data is in JSON we use d3.hierarchy
        //      If the data is in flat CSV we can use d3.stratify
        // const root = d3.hierarchy(data, (d: any) => { return d && d.map((item: any) => {return { item: item, my: "hi"}; });});
        const root = d3.hierarchy(this.state.scopedData)
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
                    backgroundColor={color(node.depth)}
                    rectStroke={"transparent"}
                    id={idx}
                    label={name}
                    name={name}
                    fontSize={"14px"}
                    textColor={"white"}
                    className="node"
                    depth={node.depth}
                    hasChildren={hasChildren}
                    value={formatConst(node.value)}
                    hoverAnimation={true}
                    onClick={this._onNodeClick}
                />
            );
        }, this);

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

    private _onNodeClick = (e: any ) => {
        debugger;
        console.log(e);
        // this.setState({scopedData:{}});
    }

}
export default TreeMap;
