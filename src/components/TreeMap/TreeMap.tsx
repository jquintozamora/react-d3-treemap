import * as React from "react";
import classnames from "classnames";
import { format } from "d3-format";

import {
  TreemapLayout,
  HierarchyRectangularNode,
  treemap,
  hierarchy,
  treemapSquarify,
} from "d3-hierarchy";
import { scaleLinear, ScaleSequential, scaleSequential } from "d3-scale";
import { extent } from "d3-array";
import { interpolateSpectral } from "d3-scale-chromatic";
import { interpolateHcl } from "d3-interpolate";

import Node, { NumberOfChildrenPlacement } from "../Node";
import Breadcrumb from "../Breadcrumb";
import { ITreeMapProps, ColorModel } from "./ITreeMapProps";
import { ITreeMapState } from "./ITreeMapState";
import { Utils } from "../../utils/Utils";
import TooltipProvider from "../Tooltip/TooltipProvider";

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
    disableBreadcrumb: false,
    colorModel: ColorModel.OneEachChildren,
    paddingInner: 0,
    customD3ColorScale: scaleSequential(interpolateSpectral),
    namePropInData: "name",
    linkPropInData: "link",
    valuePropInData: "value", // can be value, count, ...
    childrenPropInData: "children",
    numberOfChildrenPlacement: NumberOfChildrenPlacement.BottomRight,
    darkNodeTextColor: "white",
    darkNodeBorderColor: "white",
    lightNodeTextColor: "black",
    lightNodeBorderColor: "black",
    disableTooltip: false,
    tooltipOffsetX: 0,
    tooltipOffsetY: 0,
    levelsToDisplay: 1,
  };

  // Note. This treemap element initially was using treemap and hierarchy directly on the render.
  //       I noticed a performance problem when the original data "this.props.data" has more than 1500 elements.
  //       Now, the component is designed to show only the first level of nodes and when click on one expand the rest.
  private _treemap: TreemapLayout<TreeMapInputData>;
  private _rootData: HierarchyRectangularNode<TreeMapInputData>;
  private _nodes: Array<CustomHierarchyRectangularNode<TreeMapInputData>>;

  private _valueFormatFunction:
    | ((n: number | { valueOf(): number }) => string)
    | ((date: Date) => string);
  private _nodesbgColorFunction: ScaleSequential<string>;

  constructor(props: ITreeMapProps<TreeMapInputData>) {
    super(props);

    const { width, height, data, namePropInData } = props;

    this._createD3TreeMap(width, height, data);

    // Default State values
    this.state = {
      height,
      width,
      data,
      xScaleFactor: 1,
      yScaleFactor: 1,
      xScaleFunction: scaleLinear().range([0, width]),
      yScaleFunction: scaleLinear().range([0, height]),
      zoomEnabled: false,
      // TODO: Replace data.name by id
      breadcrumbItems: [
        {
          text: data[namePropInData],
          key: 0,
        },
      ],
      selectedId: 0,
      selectedNode: this._treemap(
        this._rootData
      ) as CustomHierarchyRectangularNode<TreeMapInputData>,
    };
  }

  public componentDidMount() {
    const { onTreeMapDidMount } = this.props;
    this._zoomTo(0);
    if (onTreeMapDidMount) {
      onTreeMapDidMount(this);
    }
  }

  public UNSAFE_componentWillReceiveProps(
    nextProps: ITreeMapProps<TreeMapInputData>
  ) {
    const { width, height } = nextProps;
    if (height !== this.props.height || width !== this.props.width) {
      this.setState({
        width,
        height,
        xScaleFunction: scaleLinear().range([0, width]),
        yScaleFunction: scaleLinear().range([0, height]),
        selectedNode: this._treemap(
          this._rootData
        ) as CustomHierarchyRectangularNode<TreeMapInputData>,
      });
    }
  }

  public render() {
    const { width, height, breadcrumbItems, selectedNode, data } = this.state;

    const {
      svgClassName,
      svgStyle,
      className,
      childrenPropInData,
      breadCrumbClassName,
      disableBreadcrumb,
      tooltipPlacement,
      tooltipClassName,
      disableTooltip,
      tooltipOffsetX,
      tooltipOffsetY,
      levelsToDisplay,
    } = this.props;

    this._createD3TreeMap(width, height, data);

    let reactNodes: Array<React.ReactNode> = [];
    const maxLevel = levelsToDisplay;
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
          mainNode[childrenPropInData].forEach((element) => {
            iterateAllChildren(element, level + 1);
          });
        }
      }
    };
    iterateAllChildren(selectedNode, 0);

    return (
      <TooltipProvider
        tooltipPlacement={tooltipPlacement}
        tooltipClassName={tooltipClassName}
        disableTooltip={disableTooltip}
        tooltipOffsetX={tooltipOffsetX}
        tooltipOffsetY={tooltipOffsetY}
      >
        <div className={className}>
          {disableBreadcrumb === false ? (
            <Breadcrumb
              items={breadcrumbItems}
              className={breadCrumbClassName}
            />
          ) : null}
          <svg
            className={classnames(svgClassName)}
            height={height}
            width={width}
            style={{ ...svgStyle }}
          >
            {reactNodes}
          </svg>
        </div>
      </TooltipProvider>
    );
  }

  private _createD3TreeMap(
    width: number,
    height: number,
    data: TreeMapInputData
  ) {
    const {
      valuePropInData,
      childrenPropInData,
      paddingInner,
      valueFormat,
      colorModel,
      customD3ColorScale,
      valueFn,
    } = this.props;

    // 1. Create treemap structure
    this._treemap = treemap<TreeMapInputData>()
      .size([width, height])
      .tile(treemapSquarify.ratio(1))
      .paddingOuter(3)
      .paddingTop(19)
      .paddingInner(paddingInner)
      .round(true);

    // 2. Before compute a hierarchical layout, we need a root node
    //    If the data is in JSON we use d3.hierarchy
    this._rootData = hierarchy(data)
      .sum((s) => s[valuePropInData])
      .sort(
        (a, b) => b.height - a.height || b[valuePropInData] - a[valuePropInData]
      ) as HierarchyRectangularNode<TreeMapInputData>;

    // 3. Get array of nodes
    let numberItemId = 0;
    this._nodes = this._treemap(this._rootData)
      .each((item: CustomHierarchyRectangularNode<TreeMapInputData>) => {
        item.customId = numberItemId++;
      })
      .descendants() as Array<CustomHierarchyRectangularNode<TreeMapInputData>>;

    // Format function
    try {
      this._valueFormatFunction = valueFn ? valueFn : format(valueFormat);
    } catch (e) {
      console.warn(e);
    }

    let d: [number | { valueOf(): number }, number | { valueOf(): number }];
    switch (colorModel) {
      case ColorModel.Depth:
        d = [0, Utils.getDepth<TreeMapInputData>(data, childrenPropInData) - 1];
        break;
      case ColorModel.Value:
        d = extent(this._nodes, (n) => {
          if (n.parent !== null) {
            return n[valuePropInData];
          }
        });
        break;
      case ColorModel.NumberOfChildren:
        d = extent(this._nodes, (n) =>
          n.parent !== null ? n.descendants().length : 1
        );
        break;
      case ColorModel.OneEachChildren:
        d = [data[childrenPropInData] ? data[childrenPropInData].length : 0, 0];
        break;
      default:
        break;
    }

    this._nodesbgColorFunction = customD3ColorScale.domain(d);
  }

  private _getNode(node: CustomHierarchyRectangularNode<TreeMapInputData>) {
    const {
      id: treemapId,
      valueUnit,
      hideValue,
      hideNumberOfChildren,
      nodeStyle,
      nodeClassName,
      valuePropInData,
      childrenPropInData,
      namePropInData,
      linkPropInData,
      numberOfChildrenPlacement,
      darkNodeTextColor,
      darkNodeBorderColor,
      lightNodeTextColor,
      lightNodeBorderColor,
    } = this.props;

    const {
      selectedId,
      xScaleFactor,
      xScaleFunction,
      yScaleFactor,
      yScaleFunction,
      zoomEnabled,
    } = this.state;

    const { customId, data, x0, x1, y0, y1 } = node;

    const name = data[namePropInData];
    const url = data[linkPropInData];
    const nodeClassNameFromData = data["className"];

    const hasChildren =
      node[childrenPropInData] && node[childrenPropInData].length > 0
        ? true
        : false;
    let formatted = node[valuePropInData];
    try {
      formatted = this._valueFormatFunction(node[valuePropInData]);
    } catch (e) {
      console.warn(e);
    }
    const formattedValue = `(${formatted}${valueUnit ? ` ${valueUnit}` : ""})`;

    const nodeTotalNodes = node.descendants().length - 1;

    const { bgColor, textColor, borderColor } = this._getColorsFromNode(
      node,
      nodeTotalNodes,
      {
        darkNodeTextColor,
        darkNodeBorderColor,
        lightNodeTextColor,
        lightNodeBorderColor,
      }
    );

    const isSelectedNode = customId === selectedId;

    return (
      <Node
        bgColor={bgColor}
        textColor={textColor}
        borderColor={borderColor}
        className={classnames(nodeClassName, nodeClassNameFromData)}
        style={{
          fontVariant: "normal",
          fontWeight: "normal",
          fontSize: 14,
          fontFamily: "Arial",
          ...nodeStyle,
        }}
        hasChildren={hasChildren}
        hideNumberOfChildren={hideNumberOfChildren}
        id={customId}
        isSelectedNode={isSelectedNode}
        key={customId}
        label={name}
        nodeTotalNodes={nodeTotalNodes}
        onClick={!isSelectedNode ? this._onNodeClick : undefined}
        treemapId={treemapId}
        url={url}
        value={!hideValue && formattedValue}
        x0={x0}
        x1={x1}
        xScaleFactor={xScaleFactor}
        xScaleFunction={xScaleFunction}
        y0={y0}
        y1={y1}
        yScaleFactor={yScaleFactor}
        yScaleFunction={yScaleFunction}
        zoomEnabled={zoomEnabled}
        numberOfChildrenPlacement={numberOfChildrenPlacement}
      />
    );
  }

  private _onBreadcrumbItemClicked = (ev: React.MouseEvent<HTMLElement>) => {
    this._zoomTo(Number(ev.currentTarget.id));
  };

  private _onNodeClick = (ev: React.MouseEvent<SVGElement>) => {
    this._zoomTo(parseInt(ev.currentTarget.id));
  };

  private _getColorsFromNode(
    node: CustomHierarchyRectangularNode<TreeMapInputData>,
    nodeTotalNodes: number,
    {
      darkNodeTextColor,
      darkNodeBorderColor,
      lightNodeTextColor,
      lightNodeBorderColor,
    }
  ) {
    const { colorModel, valuePropInData } = this.props;

    let backgroundColor;
    switch (colorModel) {
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
        const originalBackgroundColor = this._nodesbgColorFunction(
          Utils.getTopSubParent<TreeMapInputData>(node)
        );
        if (node.depth > 1) {
          backgroundColor = scaleLinear<string>()
            .domain([0, node && node.children ? node.children.length : 0])
            .interpolate(interpolateHcl)
            .range(["white", originalBackgroundColor])(
            Utils.getTopSubParent<TreeMapInputData>(node)
          );
        } else {
          backgroundColor = originalBackgroundColor;
        }
        if (node.parent === null) {
          backgroundColor = this._nodesbgColorFunction(0);
        }
      default:
        break;
    }

    return {
      bgColor: backgroundColor,
      textColor:
        Utils.getHighContrastColorFromString(backgroundColor) === "dark"
          ? darkNodeTextColor
          : lightNodeTextColor,
      borderColor:
        Utils.getHighContrastColorFromString(backgroundColor) === "dark"
          ? darkNodeBorderColor
          : lightNodeBorderColor,
    };
  }

  private _zoomTo(nodeId: number) {
    const { xScaleFunction, yScaleFunction, width, height } = this.state;

    const { onZoom } = this.props;

    const currentNode = this._nodes
      .filter((item: CustomHierarchyRectangularNode<TreeMapInputData>) => {
        return item.customId.toString() === nodeId.toString();
      })
      .pop();
    if (currentNode) {
      const x = currentNode.x0;
      const y = currentNode.y0;
      const dx = currentNode.x1 - currentNode.x0;
      const dy = currentNode.y1 - currentNode.y0;
      const xScaleFactor = width / dx;
      const yScaleFactor = height / dy;
      const breadcrumbItems = this._treemap(this._rootData)
        .path(currentNode)
        .map(
          ({
            data,
            customId,
          }: CustomHierarchyRectangularNode<TreeMapInputData>) => {
            return {
              text: data["name"],
              key: customId,
              onClick:
                customId !== nodeId ? this._onBreadcrumbItemClicked : undefined,
            };
          }
        );
      if (onZoom) {
        onZoom(currentNode.depth, nodeId, breadcrumbItems);
      }
      this.setState({
        xScaleFactor,
        yScaleFactor,
        xScaleFunction: xScaleFunction.domain([x, x + dx]),
        yScaleFunction: yScaleFunction.domain([y, y + dy]),
        zoomEnabled: currentNode.parent === null ? false : true,
        selectedId: nodeId,
        selectedNode: currentNode,
        breadcrumbItems,
      });
    } else {
      console.warn("No node found for " + nodeId);
    }
  }

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
}

export default TreeMap;
