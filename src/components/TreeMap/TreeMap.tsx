import "./TreeMap.css";

import * as React from "react";
import classnames from "classnames";

import Node from "../Node";
import { ITreeMapProps, ColorModel } from "./ITreeMapProps";
import { ITreeMapState } from "./ITreeMapState";
import AnimatedNode from "../AnimatedNode";
import { Utils } from "../../utils/Utils";
import { format } from "d3-format";
import {
  TreemapLayout,
  HierarchyRectangularNode,
  treemap as d3treemap,
  hierarchy as d3hierarchy,
  stratify as d3stratify,
  treemapSquarify as d3TreemapSquarify
} from "d3-hierarchy";
import { scaleLinear, scaleSequential, scaleOrdinal } from "d3-scale";
import { extent } from "d3-array";
import * as chromatic from "d3-scale-chromatic";
import { interpolateHcl, interpolateHsl } from "d3-interpolate";
import { IBreadcrumbItem, BreadcrumbStyled } from "../Breadcrumb/Breadcrumb";

export interface CustomHierarchyRectangularNode<TreeMapInputData>
  extends HierarchyRectangularNode<TreeMapInputData> {
  customId: number;
}

class TreeMap<TreeMapInputData> extends React.Component<
  ITreeMapProps<TreeMapInputData>,
  ITreeMapState<TreeMapInputData>
> {
  // Default Props values
  public static defaultProps: ITreeMapProps<{}> = {
    id: "myTreeMap",
    data: null,
    height: 600,
    width: 600,
    valueFormat: ",d",
    valueUnit: "MB",
    disableBreadcrumb: false,
    colorModel: ColorModel.Depth,
    animated: false,
    paddingInner: 0
  };

  // Note. This treemap element initially was using treemap and hierarchy directly on the render.
  //       I noticed a performance problem when the original data "this.props.data" has more than 1500 elements.
  //       Now, the component is designed to show only the first level of nodes and when click on one expand the rest.
  private _treemap: TreemapLayout<TreeMapInputData>;
  private _rootData: HierarchyRectangularNode<TreeMapInputData>;
  private _nodes: Array<CustomHierarchyRectangularNode<TreeMapInputData>>;

  // Numeric value format function
  private _valueFormatFunction: (n: number) => string;
  // Background Color function
  private _nodesbgColorFunction: (t: number) => string;

  constructor(props: ITreeMapProps<TreeMapInputData>, context: any) {
    super(props, context);

    this._createD3TreeMap(this.props.width, this.props.height, this.props.data);

    // Default State values
    this.state = {
      height: this.props.height,
      width: this.props.width,
      data: this.props.data,
      xScaleFactor: 1,
      yScaleFactor: 1,
      xScaleFunction: scaleLinear().range([0, this.props.width]),
      yScaleFunction: scaleLinear().range([0, this.props.height]),
      zoomEnabled: false,
      // TODO: Replace data.name by id
      breadCrumbItems: [
        {
          text: (this.props as any).data.name,
          key: 0,
          onClick: this._onBreadcrumbItemClicked
        }
      ],
      selectedId: 0,
      scopedNodes: this._nodes,
      selectedNode: this._treemap(
        this._rootData
      ) as CustomHierarchyRectangularNode<TreeMapInputData>,
      totalNodes: this._nodes.length,
      selectedNodeTotalNodes: this._nodes.length
    };
  }

  public componentWillReceiveProps(nextProps: ITreeMapProps<TreeMapInputData>) {
    if (
      nextProps.height !== this.props.height ||
      nextProps.width !== this.props.width
    ) {
      this.setState({
        width: nextProps.width,
        height: nextProps.height,
        xScaleFunction: scaleLinear().range([0, nextProps.width]),
        yScaleFunction: scaleLinear().range([0, nextProps.height])
      });
    }

    this._createD3TreeMap(nextProps.width, nextProps.height, nextProps.data);
    this.setState({
      data: nextProps.data,
      width: nextProps.width,
      height: nextProps.height,
      xScaleFactor: 1,
      yScaleFactor: 1,
      xScaleFunction: scaleLinear().range([0, nextProps.width]),
      yScaleFunction: scaleLinear().range([0, nextProps.height]),
      zoomEnabled: false,
      // TODO: Replace data.name by id
      breadCrumbItems: [
        {
          text: (nextProps as any).data.name,
          key: 0,
          onClick: this._onBreadcrumbItemClicked
        }
      ],
      selectedId: 0,
      scopedNodes: this._nodes,
      selectedNode: this._treemap(
        this._rootData
      ) as CustomHierarchyRectangularNode<TreeMapInputData>,
      totalNodes: this._nodes.length,
      selectedNodeTotalNodes: this._nodes.length
    });
  }

  public render() {
    const {
      width,
      height,
      breadCrumbItems,
      selectedNode,
      totalNodes,
      data
    } = this.state;

    const { svgClassName, svgStyle, className } = this.props;

    this._createD3TreeMap(width, height, data);

    let reactNodes: any = [];
    const maxLevel = 1;
    const iterateAllChildren = (
      mainNode: CustomHierarchyRectangularNode<TreeMapInputData>,
      level: number
    ): any => {
      reactNodes = reactNodes.concat(this._getNode(mainNode));
      if (level < maxLevel) {
        if (
          mainNode.hasOwnProperty("children") &&
          mainNode.children.length > 0
        ) {
          mainNode.children.forEach(element => {
            iterateAllChildren(element, level + 1);
          });
        }
      }
    };
    iterateAllChildren(selectedNode, 0);

    let highestBgColor = this._nodesbgColorFunction(totalNodes);
    let lowestBgColor = this._nodesbgColorFunction(1);
    switch (this.props.colorModel) {
      case ColorModel.OneEachChildren:
        highestBgColor = lowestBgColor = this._nodesbgColorFunction(0);
        break;
      case ColorModel.Depth:
      case ColorModel.Value:
      case ColorModel.NumberOfChildren:
      default:
        break;
    }

    return (
      <div className={className}>
        {this.props.disableBreadcrumb === false ? (
          <BreadcrumbStyled
            bgColor={lowestBgColor}
            hoverBgColor={highestBgColor}
            currentBgColor={highestBgColor}
            items={breadCrumbItems}
          />
        ) : null}
        <svg
          className={classnames("TreeMap__mainSvg", svgClassName)}
          height={height}
          width={width}
          style={{ ...svgStyle }}
        >
          {reactNodes}
        </svg>
        {/*<div>Total items: {this.state.selectedNodeTotalNodes}  / {this.state.totalNodes}</div>*/}
      </div>
    );
  }

  private _createD3TreeMap(
    width: number,
    height: number,
    data: TreeMapInputData
  ) {
    // 1. Create treemap structure
    if (!this._treemap) {
      this._treemap = d3treemap<TreeMapInputData>()
        .size([width, height])
        .tile(d3TreemapSquarify)
        .paddingOuter(3)
        .paddingTop(19)
        .paddingInner(this.props.paddingInner)
        .round(true);
    }

    // 2. Before compute a hierarchical layout, we need a root node
    //    If the data is in JSON we use d3.hierarchy
    if (!this._rootData) {
      this._rootData = d3hierarchy(data)
        .sum((s: any) => s.value)
        .sort(
          (a, b) => b.height - a.height || b.value - a.value
        ) as HierarchyRectangularNode<TreeMapInputData>;
    }

    // 3. Get array of nodes
    let numberItemId = 0;
    this._nodes = this._treemap(this._rootData)
      .each((item: CustomHierarchyRectangularNode<TreeMapInputData>) => {
        item.customId = numberItemId++;
      })
      .descendants() as Array<CustomHierarchyRectangularNode<TreeMapInputData>>;

    // Format function
    this._valueFormatFunction = format(this.props.valueFormat);

    let d: any;
    switch (this.props.colorModel) {
      case ColorModel.Depth:
        d = [0, Utils.getDepth(data) - 1];
        break;
      case ColorModel.Value:
        d = extent(this._nodes, n => {
          if (n.parent !== null) {
            return n.value;
          }
        });
        break;
      case ColorModel.NumberOfChildren:
        d = extent(this._nodes, n =>
          n.parent !== null ? n.descendants().length : 1
        );
        break;
      case ColorModel.OneEachChildren:
        d = [Utils.getTopChildren(data), 0];
        break;
      default:
        break;
    }

    // Create bgColorFunction
    if (
      this.props.hasOwnProperty("bgColorRangeLow") &&
      this.props.hasOwnProperty("bgColorRangeHigh")
    ) {
      this._nodesbgColorFunction = scaleLinear<any>()
        .domain(d)
        .interpolate(interpolateHcl)
        .range([this.props.bgColorRangeLow, this.props.bgColorRangeHigh]);
    } else {
      // Red, yellow, green: interpolateYlOrRd
      this._nodesbgColorFunction = scaleSequential(
        chromatic.interpolateSpectral
      ).domain(d);
    }
  }

  private _getNode(node: CustomHierarchyRectangularNode<TreeMapInputData>) {
    const {
      id: treemapId,
      animated,
      valueUnit,
      hideValue,
      hideNumberOfChildren,
      nodeStyle,
      nodeClassName
    } = this.props;

    const {
      totalNodes,
      selectedId,
      xScaleFactor,
      xScaleFunction,
      yScaleFactor,
      yScaleFunction,
      zoomEnabled
    } = this.state;

    const name = (node as any).data.name;
    const id = node.customId;
    const url = (node as any).data.link;
    const nodeClassNameFromData = (node as any).data.className;

    const hasChildren =
      node.children && node.children.length > 0 ? true : false;
    const formattedValue = `(${this._valueFormatFunction(
      node.value
    )} ${valueUnit})`;
    const nodeTotalNodes = node.descendants().length - 1;

    let backgroundColor;
    switch (this.props.colorModel) {
      case ColorModel.Depth:
        // Color domain = depth
        backgroundColor = this._nodesbgColorFunction(node.depth);
        if (node.parent === null) {
          backgroundColor = this._nodesbgColorFunction(0);
        }
        break;
      case ColorModel.Value:
        // Color domain = size (value)
        backgroundColor = this._nodesbgColorFunction(node.value);
        if (node.parent === null) {
          backgroundColor = this._nodesbgColorFunction(1);
        }
        break;
      case ColorModel.NumberOfChildren:
        // Color domain = number of children
        backgroundColor = this._nodesbgColorFunction(nodeTotalNodes);
        if (node.parent === null) {
          backgroundColor = this._nodesbgColorFunction(1);
        }
        break;
      case ColorModel.OneEachChildren:
        backgroundColor = this._nodesbgColorFunction(
          Utils.getTopSubParent<TreeMapInputData>(node)
        );
        if (node.parent === null) {
          backgroundColor = this._nodesbgColorFunction(0);
        }
      default:
        break;
    }

    const colorText = Utils.getHighContrastColorFromString(backgroundColor);

    const NodeComponent = animated ? AnimatedNode : Node;

    return (
      <NodeComponent
        bgColor={backgroundColor}
        className={classnames(nodeClassName, nodeClassNameFromData)}
        style={nodeStyle}
        fontSize={14}
        globalTotalNodes={totalNodes}
        hasChildren={hasChildren}
        hideNumberOfChildren={hideNumberOfChildren}
        id={id}
        isSelectedNode={id === selectedId}
        key={id}
        label={name}
        name={name}
        nodeTotalNodes={nodeTotalNodes}
        onClick={this._onNodeClick}
        textColor={colorText}
        treemapId={treemapId}
        url={url}
        value={!hideValue && formattedValue}
        x0={node.x0}
        x1={node.x1}
        xScaleFactor={xScaleFactor}
        xScaleFunction={xScaleFunction}
        y0={node.y0}
        y1={node.y1}
        yScaleFactor={yScaleFactor}
        yScaleFunction={yScaleFunction}
        zoomEnabled={zoomEnabled}
      />
    );
  }

  private _onBreadcrumbItemClicked = (
    ev: React.MouseEvent<HTMLElement>,
    item: IBreadcrumbItem
  ) => {
    this._zoomTo(parseInt(item.key));
  };

  private _onNodeClick = (ev: React.MouseEvent<HTMLElement>) => {
    this._zoomTo(parseInt(ev.currentTarget.id));
  };

  public resetZoom() {
    this._zoomTo(0);
  }

  public zoomOut() {
    const { selectedId } = this.state;
    const selectedNode = this._nodes
      .filter((item: CustomHierarchyRectangularNode<TreeMapInputData>) => {
        return item.customId === selectedId;
      })
      .pop();
    if (
      selectedNode &&
      selectedNode.parent &&
      selectedNode.parent.customId !== undefined
    ) {
      this._zoomTo(selectedNode.parent.customId);
    }
  }

  public getZoomLevel() {
    const { selectedNode } = this.state;
    return selectedNode.depth;
  }

  private _zoomTo(nodeId: number) {
    const {
      selectedId,
      xScaleFunction,
      yScaleFunction,
      width,
      height
    } = this.state;

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
            return {
              text: n.data.name,
              key: n.customId,
              onClick: this._onBreadcrumbItemClicked
            };
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
