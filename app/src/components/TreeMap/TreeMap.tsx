import * as React from "react";

import NodeContainer from "../NodeContainer/NodeContainer";
import { Utils } from "../../utils/Utils";
import { format } from "d3-format";
import {
    TreemapLayout,
    HierarchyRectangularNode,
    treemap as d3treemap,
    hierarchy as d3hierarchy
} from "d3-hierarchy";
import {
    scaleLinear,
    scaleSequential,
    interpolateViridis
} from "d3-scale";
import { interpolateHcl } from "d3-interpolate";
import {
    Breadcrumb, IBreadcrumbItem
} from 'office-ui-fabric-react/lib/Breadcrumb';

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
    private _rootData: any;
    private _nodes: HierarchyRectangularNode<{}>[];

    constructor(props: ITreeMapProps, context: any) {
        super(props, context);

        // Default State values
        this.state = {
            scopedData: this.props.data,
            height: this.props.height,
            width: this.props.width,
            xScaleFactor: 1,
            yScaleFactor: 1,
            xScaleFunction: scaleLinear().range([0, this.props.width]),
            yScaleFunction: scaleLinear().range([0, this.props.height]),
            zoomEnabled: false,
            // TODO: Replace data.name by id
            breadCrumbItems: [{ text: '[Root]', 'key': this.props.data.name, onClick: this._onBreadcrumbItemClicked }],
            selectedId: this.props.data.name
        };

        // Format function
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
        const { valueFormat, colorText, borderColorHover } = this.props;
        const { width, height } = this.state;

        // 1. Create treemap structure
        this._treemap = d3treemap()
            .size([width, height])
            .paddingOuter(3)
            .paddingTop(19)
            .paddingInner(1)
            .round(true);

        // 2. Before compute a hierarchical layout, we need a root node
        //    If the data is in JSON we use d3.hierarchy
        this._rootData = d3hierarchy(this.state.scopedData)
            .sum((d: any) => d.value)
            .sort((a, b) => b.height - a.height || b.value - a.value);

        // 3. Get array of nodes
        this._nodes = this._treemap(this._rootData)
            .descendants()

        let breadCrumbItems;
        const reactNodes = this._nodes.map((node, idx) => {
            const name = (node as any).data.name;
            // TODO: Change this Id value by the right id
            const id = (node as any).data.name;
            const hasChildren = node.children && node.children.length > 0 ? true : false;
            const backgroundColor = this._nodesbgColorFunction(node.depth);
            const valueWithFormat = this._valueFormatFunction(node.value);

            // Get breadcrumb nodes using path function.
            if (id === this.state.selectedId) {
                breadCrumbItems = this._treemap(this._rootData)
                    .path(node)
                    .map((n: any) => {
                        return { text: n.data.name, 'key': n.data.name, onClick: this._onBreadcrumbItemClicked };
                    });
            }

            return (
                <NodeContainer
                    {...node}
                    id={id}
                    xScaleFactor={this.state.xScaleFactor}
                    yScaleFactor={this.state.yScaleFactor}
                    xScaleFunction={this.state.xScaleFunction}
                    yScaleFunction={this.state.yScaleFunction}
                    zoomEnabled={this.state.zoomEnabled}
                    key={idx}
                    bgColor={backgroundColor}
                    bgOpacity="1"
                    borderColorHover={borderColorHover}
                    label={name}
                    name={name}
                    fontSize={"14px"}
                    textColor={colorText}
                    className="node"
                    hasChildren={hasChildren}
                    hoverAnimation={true}
                    onClick={this._onNodeClick}
                    valueWithFormat={valueWithFormat}
                />
            );
        });



        return (
            <div>
                <Breadcrumb
                    items={breadCrumbItems}
                    maxDisplayedItems={4} />
                <svg
                    className="treemap__Container"
                    height={height}
                    width={width}
                >
                    {reactNodes}
                </svg>
            </div>

        );
    }

    private _onBreadcrumbItemClicked = (ev: React.MouseEvent<HTMLElement>, item: IBreadcrumbItem) => {
        this._zoomTo(item.key);
    }

    private _onNodeClick = (ev: React.MouseEvent<HTMLElement>) => {
        this._zoomTo(ev.currentTarget.id);
    }

    private _zoomTo(nodeId: string) {
        const currentNodeArray = this._nodes.filter((item: any) => {
            return item.data.name === nodeId;
        });
        if (currentNodeArray.length > 0) {
            const currentNode = currentNodeArray[0];
            var x = currentNode.x0;
            var y = currentNode.y0;
            var dx = currentNode.x1 - currentNode.x0;
            var dy = currentNode.y1 - currentNode.y0;
            const xScaleFactor = this.state.width / dx;
            const yScaleFactor = this.state.height / dy;
            this.setState({
                xScaleFactor,
                yScaleFactor,
                xScaleFunction: this.state.xScaleFunction.domain([x, x + dx]),
                yScaleFunction: this.state.yScaleFunction.domain([y, y + dy]),
                zoomEnabled: true,
                selectedId: nodeId
            });
        } else {
            console.warn("No node found for " + nodeId);
        }
    }

}
export default TreeMap;
