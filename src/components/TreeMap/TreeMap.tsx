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
  treemapSquarify as d3TreemapSquarify
} from "d3-hierarchy";
import { scaleLinear, scaleSequential } from "d3-scale";
import { extent } from "d3-array";
import * as chromatic from "d3-scale-chromatic";
import { interpolateHcl } from "d3-interpolate";
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
    paddingInner: 0,
    customD3ColorScale: scaleSequential(chromatic.interpolateSpectral),
    namePropInData: "name",
    linkPropInData: "link",
    valuePropInData: "value", // can be value, count, ...
    childrenPropInData: "children"
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

  constructor(props: ITreeMapProps<TreeMapInputData>) {
    super(props);

    const { width, height, data, namePropInData } = props;

    this._createD3TreeMap(width, height, data);

    // Default State values
    this.state = {
      height: height,
      width: width,
      data: data,
      xScaleFactor: 1,
      yScaleFactor: 1,
      xScaleFunction: scaleLinear().range([0, width]),
      yScaleFunction: scaleLinear().range([0, height]),
      zoomEnabled: false,
      // TODO: Replace data.name by id
      breadCrumbItems: [
        {
          text: data[namePropInData],
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
    const { width, height, data, namePropInData } = nextProps;

    if (height !== this.props.height || width !== this.props.width) {
      this.setState({
        width,
        height,
        xScaleFunction: scaleLinear().range([0, width]),
        yScaleFunction: scaleLinear().range([0, height])
      });
    }

    this._createD3TreeMap(width, height, data);
    this.setState({
      data,
      width,
      height,
      xScaleFactor: 1,
      yScaleFactor: 1,
      xScaleFunction: scaleLinear().range([0, width]),
      yScaleFunction: scaleLinear().range([0, height]),
      zoomEnabled: false,
      // TODO: Replace data.name by id
      breadCrumbItems: [
        {
          text: data[namePropInData],
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

    const {
      svgClassName,
      svgStyle,
      className,
      childrenPropInData
    } = this.props;

    this._createD3TreeMap(width, height, data);

    let reactNodes: Array<React.ReactNode> = [];
    const maxLevel = 1;
    const iterateAllChildren = (
      mainNode: CustomHierarchyRectangularNode<TreeMapInputData>,
      level: number
    ) => {
      reactNodes = reactNodes.concat(this._getNode(mainNode));
      if (level < maxLevel) {
        if (
          mainNode.hasOwnProperty(childrenPropInData) &&
          mainNode[childrenPropInData].length > 0
        ) {
          mainNode[childrenPropInData].forEach(element => {
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
    const { valuePropInData } = this.props;

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
        .sum(s => s[valuePropInData])
        .sort(
          (a, b) =>
            b.height - a.height || b[valuePropInData] - a[valuePropInData]
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

    let d: [number | { valueOf(): number }, number | { valueOf(): number }];
    switch (this.props.colorModel) {
      case ColorModel.Depth:
        d = [0, Utils.getDepth(data) - 1];
        break;
      case ColorModel.Value:
        d = extent(this._nodes, n => {
          if (n.parent !== null) {
            return n[valuePropInData];
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
      this._nodesbgColorFunction = scaleLinear<string>()
        .domain(d)
        .interpolate(interpolateHcl)
        .range([this.props.bgColorRangeLow, this.props.bgColorRangeHigh]);
    } else {
      this._nodesbgColorFunction = this.props.customD3ColorScale.domain(d);

      // Red, yellow, green: interpolateYlOrRd
      // this._nodesbgColorFunction = scaleSequential(
      //   chromatic.interpolateSpectral
      // ).domain(d);
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
      nodeClassName,
      valuePropInData,
      childrenPropInData,
      namePropInData,
      linkPropInData
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

    const name = node.data[namePropInData];
    const id = node.customId;
    const url = node.data[linkPropInData];
    const nodeClassNameFromData = node.data["className"];

    const hasChildren =
      node[childrenPropInData] && node[childrenPropInData].length > 0
        ? true
        : false;
    const formattedValue = `(${this._valueFormatFunction(
      node[valuePropInData]
    )} ${valueUnit})`;
    const nodeTotalNodes = node.descendants().length - 1;

    let backgroundColor;
    switch (this.props.colorModel) {
      case ColorModel.Depth:
        backgroundColor = this._nodesbgColorFunction(node.depth);
        if (node.parent === null) {
          backgroundColor = this._nodesbgColorFunction(0);
        }
        break;
      case ColorModel.Value:
        backgroundColor = this._nodesbgColorFunction(node[valuePropInData]);
        if (node.parent === null) {
          backgroundColor = this._nodesbgColorFunction(1);
        }
        break;
      case ColorModel.NumberOfChildren:
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
      const currentNodeArray = this._nodes.filter(
        (item: CustomHierarchyRectangularNode<TreeMapInputData>) => {
          return item.customId.toString() === nodeId.toString();
        }
      );
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
          .map((n: CustomHierarchyRectangularNode<TreeMapInputData>) => {
            return {
              text: n.data["name"],
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
