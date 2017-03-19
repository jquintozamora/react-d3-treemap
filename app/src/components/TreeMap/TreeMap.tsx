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

class TreeMap extends React.Component<ITreeMapProps, {}> {

    public hovered(hover: number) {
        return (e: any) => {
            e.stopPropagation();
            console.log(e.target);
            // Todo, transfer the hover class to React state at Node component level

            // d.ancestors().map(function (d: any) { return d.node; })
            //     .classed("node--hover", hover)
            //     .select("rect")
            //     .attr("width", function (d: any) { return d.x1 - d.x0 - hover; })
            //     .attr("height", function (d: any) { return d.y1 - d.y0 - hover; });
        };
    }

    public render() {

        // Tree map based on d3:
        // https://bl.ocks.org/mbostock/911ad09bdead40ec0061
        // https://bl.ocks.org/mbostock/f85ffb3a5ac518598043
        // CLickable: https://bl.ocks.org/mbostock/8fe6fa6ed1fa976e5dd76cfa4d816fec
        // Other react projects:
        // https://github.com/yang-wei/rd3/blob/master/src/treemap/Treemap.jsx

        const width = 600,
            height = 300;

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
        const root = d3.hierarchy(data)
            .sum((d: any) => d.value)
            .sort((a, b) => b.height - a.height || b.value - a.value);

        // Get array of nodes
        const nodes = treemap(root).descendants();
        const reactNodes3 = nodes.map((node, idx) => {
            const name = (node as any).data.name;
            return (
                <g
                    transform={`translate(${node.x0},${node.y0})`}
                    className="node"
                    onMouseOver={this.hovered(1)}
                    onMouseOut={this.hovered(0)}
                >
                    <rect
                        id={"rect-" + name}
                        width={node.x1 - node.x0}
                        height={node.y1 - node.y0}
                        fill={color(node.depth)}
                    />
                    <clipPath
                        id={"clip-" + name}
                    >
                        <use xlinkHref={"#rect-" + name + ""} />
                    </clipPath>
                    <text
                        clipPath={"url(#clip-" + name + ")"}
                    >
                        {
                            node.children ?
                                <tspan x={idx ? null : 4} y={13}>
                                    {name.substring(name.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).concat("\xa0" + formatConst(node.value))}
                                </tspan> :
                                <tspan x={4} y={13 + idx * 10}>
                                    {name.substring(name.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).concat(formatConst(node.value))}
                                </tspan>
                        }
                    </text>
                    <title>{name + "\n" + formatConst(node.value)}</title>
                </g>
            );
        }, this);

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
                    label={name}
                    id={name}
                    fontSize={"14px"}
                    textColor={"white"}
                    className="node"
                    depth={node.depth}
                    hasChildren={hasChildren}
                    value={node.value.toString()}
                    hoverAnimation={true}
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

}
export default TreeMap;
