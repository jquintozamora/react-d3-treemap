import * as React from "react";

// import NodeContainer from "../NodeContainer/NodeContainer";
import NodeContainer from "../NodeContainer/NodeContainer.Animated";

import { Utils } from "../../utils/Utils";
import { format } from "d3-format";
import {
    TreemapLayout,
    HierarchyRectangularNode,
    treemap as d3treemap,
    hierarchy as d3hierarchy,
    stratify as d3stratify
} from "d3-hierarchy";
import {
    scaleLinear,
    scaleSequential,
    scaleOrdinal,
    schemeCategory10,
    schemeCategory20c,
    interpolateViridis
} from "d3-scale";
import {
    extent
} from "d3-array";
import * as chromatic from "d3-scale-chromatic";
import { interpolateHcl } from "d3-interpolate";
import {
    IBreadcrumbItem, BreadcrumbStyled
} from "../Breadcrumb/Breadcrumb";

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
        valueUnit: "MB"
    };


    // Note. This treemap element initially was using treemap and hierarchy directly on the render.
    //       I noticed a performance problem when the original data "this.props.data" has more than 1500 elements.
    //       Now, the component is designed to show only the first level of nodes and when click on one expand the rest.
    private _treemap: TreemapLayout<{}>;
    private _rootData: any;
    private _nodes: HierarchyRectangularNode<{}>[];


    // Numeric value format function
    private _valueFormatFunction: (n: number) => string;
    // Background Color function
    private _nodesbgColorFunction: (t: number) => string;


    constructor(props: ITreeMapProps, context: any) {
        super(props, context);

        this._createD3TreeMap(this.props.width, this.props.height);

        // Default State values
        this.state = {
            fontSize: 15,
            height: this.props.height,
            width: this.props.width,
            xScaleFactor: 1,
            yScaleFactor: 1,
            xScaleFunction: scaleLinear().range([0, this.props.width]),
            yScaleFunction: scaleLinear().range([0, this.props.height]),
            zoomEnabled: false,
            // TODO: Replace data.name by id
            breadCrumbItems: [{ text: this.props.data.name, 'key': 0, onClick: this._onBreadcrumbItemClicked }],
            selectedId: 0,
            scopedNodes: this._nodes,
            selectedNode: this._treemap(this._rootData),
            totalNodes: this._nodes.length,
            selectedNodeTotalNodes: this._nodes.length
        };

    }

    public componentWillReceiveProps(nextProps: ITreeMapProps) {
        if (nextProps.height !== this.props.height
            || nextProps.width !== this.props.width) {

            this.setState({
                width: nextProps.width,
                height: nextProps.height,
                xScaleFunction: scaleLinear().range([0, nextProps.width]),
                yScaleFunction: scaleLinear().range([0, nextProps.height])
            });
        }
    }

    public render() {
        const { width, height, breadCrumbItems, selectedNode, totalNodes } = this.state;

        this._createD3TreeMap(width, height);

        let reactNodes: any = [];
        const maxLevel = 1;

        const iterateAllChildren = (mainNode: HierarchyRectangularNode<{}>, level: number): any => {
            reactNodes = reactNodes.concat(this._getNode(mainNode));
            if (level < maxLevel) {
                if (mainNode.hasOwnProperty("children")
                    && mainNode.children.length > 0) {
                    mainNode.children.forEach(element => {
                        iterateAllChildren(element, level + 1);
                    });
                }
            }
        };
        iterateAllChildren(selectedNode, 0);

        //remove first element from the array as this is some kind of header and we do not need it
        reactNodes.shift();

        const reactNodesAggregated = this._aggregateSmall(reactNodes, 10000);

        const highestBgColor = this._nodesbgColorFunction(totalNodes);
        const lowestBgColor = this._nodesbgColorFunction(1);
        return (
            <div>
                {/* <BreadcrumbStyled
                    bgColor={lowestBgColor}
                    hoverBgColor={highestBgColor}
                    currentBgColor={highestBgColor}
                    items={breadCrumbItems}
                /> */}
                <svg
                    className={styles.mainSvg}
                    height={height}
                    width={width}
                >
                    <rect className="svg-group-wrapper"  height={height} width={width}>
                    </rect>
                    {reactNodesAggregated}
                </svg>
                {/*<div>Total items: {this.state.selectedNodeTotalNodes}  / {this.state.totalNodes}</div>*/}
            </div>

        );
    }


    private _aggregateSmall( arr: Array<any>, threshold: number) {
        const { fontSize } = this.state;

        const aggegated = {};
        const xArr = [];
        const yArr = [];
        let aggrValue = 0;

        const filtered = arr.filter( obj => {
            const { x0, x1, y0, y1, value} = obj.props;

            const tooSmall = (x0 - x1) * (y0 - y1) < threshold;

            if (tooSmall) {
                xArr.push(x0);
                xArr.push(x1);
                yArr.push(y0);
                yArr.push(y1);
                aggrValue += value;
            }
            return tooSmall ? false : true;
        });

        const xSorted = xArr.sort((a, b) => a > b);
        const ySorted = yArr.sort((a, b) => a > b);

        const x0 = xSorted[0];
        const x1 = xSorted[xSorted.length - 1];
        const y0 = ySorted[0];
        const y1 = ySorted[ySorted.length - 1];

        const translate = `translate(${x0}, ${y0})`;
        const id = filtered.length + 1;
        const width = x1 - x0;
        const height = y1 - y0;

        const aggrNode =
            <g
                key="aggrNode"
                transform={translate}>
                <rect
                    id={"rect-" + id}
                    width={width}
                    height={height}
                />
                 <text y="10">
                    <tspan
                        className='segment-name'
                        fontSize={fontSize}
                        x="10"
                        dy={fontSize}
                        >
                       Others
                    </tspan>
                    <tspan
                        className='segment-value'
                        fontSize={fontSize + 2}
                        x={10}
                        dy={fontSize + 5}>
                       {aggrValue}
                    </tspan>
                </text>
            </g>;

        filtered.push(aggrNode);

        return filtered;
    }

    private _createD3TreeMap(width: number, height: number) {
        // 1. Create treemap structure
        this._treemap = d3treemap()
            .size([width, height])
            .paddingOuter(10)
            .paddingInner(0)
            .round(true);

        // 2. Before compute a hierarchical layout, we need a root node
        //    If the data is in JSON we use d3.hierarchy
        this._rootData = d3hierarchy(this.props.data)
            .sum((d: any) => d.value)
            .sort((a, b) => b.height - a.height || b.value - a.value);

        // 3. Get array of nodes
        let numberItemId = 0;
        this._nodes = this._treemap(this._rootData)
            .each((item: any) => {
                item.customId = numberItemId++;
            })
            .descendants();

        // Format function
        this._valueFormatFunction = format(this.props.valueFormat);

        // Color domain = depth
        // const d = [Utils.getDepth(this.props.data) - 1, 0];

        // Color domain = number of children
        const d = extent(this._nodes, (n) => n.parent !== null ? n.descendants().length : 1);
        // const d = extent(this._nodes, (n) => n.descendants().length );

        // Color domain = size (value)
        // const d = extent(this._nodes, (n) => {
        //     if (n.parent !== null) {
        //         return n.value;
        //     }
        // });

        // Create bgColorFunction
        if (this.props.hasOwnProperty("bgColorRangeLow")
            && this.props.hasOwnProperty("bgColorRangeHigh")) {
            this._nodesbgColorFunction = scaleLinear<any>()
                .domain(d)
                .interpolate(interpolateHcl)
                .range([this.props.bgColorRangeLow, this.props.bgColorRangeHigh]);
        } else {
            // Red, yellow, green: interpolateYlOrRd
            this._nodesbgColorFunction =
                scaleSequential(chromatic.interpolateGreens)
                    .domain(d);
        }
    }

    private _getNode(node: HierarchyRectangularNode<{}>) {
        const { valueFormat } = this.props;
        const { width, height, totalNodes, fontSize } = this.state;


        const name = (node as any).data.name;
        const id = (node as any).customId;
        const hasChildren = node.children && node.children.length > 0 ? true : false;
        const valueWithFormat = this._valueFormatFunction(node.value);
        const nodeTotalNodes = node.descendants().length;
        // Color domain = depth
        // const backgroundColor = this._nodesbgColorFunction(node.depth);
        // Color domain = size (value)
        // const backgroundColor = this._nodesbgColorFunction(node.value);
        // Color domain = number of children
        let backgroundColor = this._nodesbgColorFunction(nodeTotalNodes);
        if (node.parent === null) {
            backgroundColor = this._nodesbgColorFunction(1);
        }
        const colorText = Utils.getHighContrastColorFromString(backgroundColor);

        return (
            <NodeContainer
                {...node}
                id={id}
                xScaleFactor={this.state.xScaleFactor}
                yScaleFactor={this.state.yScaleFactor}
                xScaleFunction={this.state.xScaleFunction}
                yScaleFunction={this.state.yScaleFunction}
                zoomEnabled={this.state.zoomEnabled}
                key={id}
                bgColor={backgroundColor}
                label={name}
                name={name}
                fontSize={fontSize}
                textColor={colorText}
                className="node"
                hasChildren={hasChildren}
                onClick={this._onNodeClick}
                valueWithFormat={valueWithFormat}
                globalHeight={height}
                globalWidth={width}
                nodeTotalNodes={nodeTotalNodes}
                globalTotalNodes={totalNodes}
                isSelectedNode={id === this.state.selectedId}
                valueUnit={this.props.valueUnit}
            />
        );
    }

    private _onBreadcrumbItemClicked = (ev: React.MouseEvent<HTMLElement>, item: IBreadcrumbItem) => {
        this._zoomTo(item.key);
    }

    private _onNodeClick = (ev: React.MouseEvent<HTMLElement>) => {
        this._zoomTo(ev.currentTarget.id);
    }

    private _zoomTo(nodeId: string) {
        const { selectedId, xScaleFunction, yScaleFunction, width, height } = this.state;

        if (selectedId !== nodeId) {
            const currentNodeArray = this._nodes.filter((item: any) => {
                return item.customId.toString() === nodeId.toString();
            });
            if (currentNodeArray.length > 0) {
                const currentNode = currentNodeArray[0];
                const scopedNodes = currentNode.descendants();
                const x = currentNode.x0;
                const y = currentNode.y0;
                const dx = currentNode.x1 - currentNode.x0;
                const dy = currentNode.y1 - currentNode.y0;
                const xScaleFactor = width / dx;
                const yScaleFactor = height / dy;
                const breadCrumbItems = this._treemap(this._rootData)
                    .path(currentNode)
                    .map((n: any) => {
                        return { text: n.data.name, key: n.customId, onClick: this._onBreadcrumbItemClicked };
                    });
                this.setState({
                    xScaleFactor,
                    yScaleFactor,
                    xScaleFunction: xScaleFunction.domain([x, x + dx]),
                    yScaleFunction: yScaleFunction.domain([y, y + dy]),
                    zoomEnabled: currentNode.parent === null ? false : true,
                    selectedId: nodeId,
                    selectedNode: currentNode,
                    scopedNodes,
                    selectedNodeTotalNodes: scopedNodes.length,
                    breadCrumbItems
                });
            } else {
                console.warn("No node found for " + nodeId);
            }
        }

    }

}
export default TreeMap;
