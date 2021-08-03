import * as React from "react";
import classnames from "classnames";

import { HierarchyRectangularNode } from "d3-hierarchy";
import { scaleLinear, scaleSequential } from "d3-scale";
import { interpolateSpectral } from "d3-scale-chromatic";
import { interpolateHcl } from "d3-interpolate";

import Node, { NumberOfChildrenPlacement } from "../Node";
import Breadcrumb from "../Breadcrumb";
import { ITreeMapProps, ColorModel } from "./ITreeMapProps";
import { ITreeMapState } from "./ITreeMapState";
import TooltipProvider from "../Tooltip/TooltipProvider";
import {
  getColorDomainFn,
  getHighContrastColorFromString,
  getTopParent,
  getTopSubParentId,
  getValueFormatFn,
} from "./helpers";
import { useTreeMap } from "./hooks";

export interface CustomHierarchyRectangularNode<TreeMapInputData>
  extends HierarchyRectangularNode<TreeMapInputData> {
  customId: number;
}

class TreeMap<TreeMapInputData> extends React.Component<
  ITreeMapProps<TreeMapInputData>,
  ITreeMapState<TreeMapInputData>
> {
  // Default Props values
  public static defaultProps = {
    id: "myTreeMap",
    data: null,
    height: 600,
    width: 600,
    valueFormat: ",d",
    disableBreadcrumb: false,
    colorModel: ColorModel.OneEachChildren,
    paddingInner: 4,
    paddingOuter: 4,
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

  constructor(props: ITreeMapProps<TreeMapInputData>) {
    super(props);

    const {
      width,
      height,
      data,
      namePropInData,
      valuePropInData,
      paddingOuter,
    } = props;

    const topNode = useTreeMap({
      width,
      height,
      data,
      valuePropInData,
      paddingOuter,
    });

    this.state = {
      height,
      width,
      xScaleFunction: scaleLinear()
        .range([0, width])
        .domain([topNode.x0, topNode.x1]),
      yScaleFunction: scaleLinear()
        .range([0, height])
        .domain([topNode.y0, topNode.y1]),
      breadcrumbItems: [{ text: data[namePropInData], key: 0 }],
      selectedNode: topNode,
    };
  }

  public componentDidMount(): void {
    const { onTreeMapDidMount } = this.props;
    this._zoomTo(0);
    if (onTreeMapDidMount) {
      onTreeMapDidMount(this);
    }
  }

  public UNSAFE_componentWillReceiveProps(
    nextProps: ITreeMapProps<TreeMapInputData>
  ): void {
    const { width, height } = nextProps;
    if (height !== this.props.height || width !== this.props.width) {
      const { selectedNode } = this.state;
      this.setState({
        width,
        height,
        xScaleFunction: scaleLinear()
          .range([0, width])
          .domain([selectedNode.x0, selectedNode.x1]),
        yScaleFunction: scaleLinear()
          .range([0, height])
          .domain([selectedNode.y0, selectedNode.y1]),
      });
    }
  }

  public render(): React.ReactNode {
    const { width, height, breadcrumbItems, selectedNode } = this.state;

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

    let reactNodes: Array<React.ReactNode> = [];
    const maxLevel = selectedNode.depth === 0 ? levelsToDisplay : 1;
    const iterateAllChildren = (
      mainNode: CustomHierarchyRectangularNode<TreeMapInputData>,
      level: number
    ) => {
      reactNodes = reactNodes.concat(this._getNode(mainNode));

      if (level < maxLevel) {
        if (
          childrenPropInData in mainNode &&
          mainNode[childrenPropInData].length > 0
        ) {
          mainNode[childrenPropInData].forEach(
            (element: CustomHierarchyRectangularNode<TreeMapInputData>) => {
              iterateAllChildren(element, level + 1);
            }
          );
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
      paddingInner,
      valueFn,
      valueFormat,
      splitRegExp,
    } = this.props;

    const { xScaleFunction, yScaleFunction, selectedNode } = this.state;

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
      formatted = getValueFormatFn(valueFn, valueFormat)(node[valuePropInData]);
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

    const isSelectedNode = customId === selectedNode.customId;

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
        xScaleFunction={xScaleFunction}
        y0={y0}
        y1={y1}
        yScaleFunction={yScaleFunction}
        numberOfChildrenPlacement={numberOfChildrenPlacement}
        paddingInner={paddingInner}
        splitRegExp={splitRegExp}
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
    const {
      colorModel,
      valuePropInData,
      customD3ColorScale,
      data,
      childrenPropInData,
    } = this.props;

    const colorDomainFn = getColorDomainFn(
      getTopParent(node),
      data,
      colorModel,
      childrenPropInData,
      valuePropInData,
      customD3ColorScale
    );

    let backgroundColor;
    switch (colorModel) {
      case ColorModel.Depth:
        backgroundColor = colorDomainFn(node.depth);
        if (node.parent === null) {
          backgroundColor = colorDomainFn(0);
        }
        break;
      case ColorModel.Value:
        backgroundColor = colorDomainFn(node[valuePropInData]);
        if (node.parent === null) {
          backgroundColor = colorDomainFn(1);
        }
        break;
      case ColorModel.NumberOfChildren:
        backgroundColor = colorDomainFn(nodeTotalNodes);
        if (node.parent === null) {
          backgroundColor = colorDomainFn(1);
        }
        break;
      case ColorModel.OneEachChildren: {
        const originalBackgroundColor = colorDomainFn(
          getTopSubParentId<TreeMapInputData>(node)
        );
        if (node.depth > 1) {
          backgroundColor = scaleLinear<string>()
            .domain([0, node && node.children ? node.children.length : 0])
            .interpolate(interpolateHcl)
            .range(["white", originalBackgroundColor])(
            getTopSubParentId<TreeMapInputData>(node)
          );
        } else {
          backgroundColor = originalBackgroundColor;
        }
        if (node.parent === null) {
          backgroundColor = colorDomainFn(0);
        }
      }
    }

    return {
      bgColor: backgroundColor,
      textColor:
        getHighContrastColorFromString(backgroundColor) === "dark"
          ? darkNodeTextColor
          : lightNodeTextColor,
      borderColor:
        getHighContrastColorFromString(backgroundColor) === "dark"
          ? darkNodeBorderColor
          : lightNodeBorderColor,
    };
  }

  private _zoomTo(nodeId: number) {
    const { xScaleFunction, yScaleFunction, selectedNode } = this.state;

    const { onZoom } = this.props;

    const currentNode = getTopParent(selectedNode)
      .descendants()
      .filter((item: CustomHierarchyRectangularNode<TreeMapInputData>) => {
        return item.customId.toString() === nodeId.toString();
      })
      .pop();
    if (currentNode) {
      const breadcrumbItems = getTopParent(currentNode)
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
        xScaleFunction: xScaleFunction.domain([currentNode.x0, currentNode.x1]),
        yScaleFunction: yScaleFunction.domain([currentNode.y0, currentNode.y1]),
        selectedNode: currentNode,
        breadcrumbItems,
      });
    } else {
      console.warn("No node found for " + nodeId);
    }
  }

  public resetZoom(): void {
    this._zoomTo(0);
  }

  public zoomOut(): void {
    const { selectedNode } = this.state;
    if (
      selectedNode &&
      selectedNode.parent &&
      selectedNode.parent.customId !== undefined
    ) {
      this._zoomTo(selectedNode.parent.customId);
    }
  }

  public getZoomLevel(): number {
    const { selectedNode } = this.state;
    return selectedNode.depth;
  }
}

export default TreeMap;
