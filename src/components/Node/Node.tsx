import * as React from "react";
import { HierarchyRectangularNode } from "d3-hierarchy";

/* tslint:disable:no-var-requires */
const styles: any = require("./Node.module.css");
/* tslint:enable:no-var-requires */

export interface NodeProps {
  /*
        HierarchyRectangularNode properties
    */
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  // data: any;
  // readonly depth: number;
  // readonly height: number;
  // parent: HierarchyRectangularNode<any> | null;
  // children?: Array<HierarchyRectangularNode<any>>;
  /**
   * Aggregated numeric value as calculated by sum(value) or count(),
   * if previously invoked.
   */
  readonly value?: number;
  /**
   * Optional Node Id string set by StratifyOperator, if
   * hierarchical data was created from tabular data using stratify()
   */
  // readonly id?: string;
  id: number;

  // Position props
  // x0: number;
  // y0: number;
  // x1: number;
  // y1: number;
  // depth: number;
  xScaleFactor?: number;
  yScaleFactor?: number;
  xScaleFunction?: any;
  yScaleFunction?: any;
  zoomEnabled?: boolean;
  // globalHeight: number;
  // globalWidth: number;
  isSelectedNode: boolean;
  nodeTotalNodes: number;
  globalTotalNodes: number;

  xTranslated?: number;
  yTranslated?: number;
  width?: number;
  height?: number;

  // optional style to apply to the control
  style?: object;

  // Label and name props.
  name: string;
  label: string;

  // Style props
  className: string;
  bgColor: string; // fill
  textColor: string;
  fontSize: number;
  valueWithFormat: string;

  // Events props
  onClick?: any;

  // Others
  hasChildren: boolean;

  valueUnit: string;

  url: string;

  hideNumberOfChildren?: boolean;
  hideValue?: boolean;

  treemapId?: string;
}

const getNumberItemsWidthByNumberOfChars = (
  fontSize: number,
  numberOfChars: number
) => {
  return (fontSize / 2) * numberOfChars + 5;
};

const LabelNewLine = ({
  label,
  textColor,
  fontSize,
  valueWithFormat,
  valueUnit,
  hasChildren,
  hideValue
}) => {
  if (hasChildren === true) {
    const fullLabel = hideValue
      ? label
      : label + "\xa0(" + valueWithFormat + " " + valueUnit + ")";
    return (
      <tspan fontSize={fontSize} fill={textColor} dx={4} dy={fontSize}>
        {fullLabel}
      </tspan>
    );
  } else {
    if (label) {
      const fullLabel = hideValue
        ? label.split(/(?=[A-Z][^A-Z])/g)
        : label
            .split(/(?=[A-Z][^A-Z])/g)
            .concat("(" + valueWithFormat + " " + valueUnit + ")");
      return fullLabel.map((item, index) => {
        return (
          <tspan
            fontSize={fontSize}
            fill={textColor}
            key={index}
            x={4}
            dy={fontSize}
          >
            {item}
          </tspan>
        );
      });
    } else {
      return null;
    }
  }
};

const NumberOfItemsRect = ({
  bgColor,
  name,
  width,
  height,
  fontSize,
  textColor,
  nodeTotalNodes
}) => {
  const itemsWidth = getNumberItemsWidthByNumberOfChars(
    fontSize,
    nodeTotalNodes.toString().length
  );
  const itemsHeight = fontSize;
  if (width > itemsWidth && height > itemsHeight) {
    return (
      <g>
        <rect
          id={"rectNumberItems-" + name}
          x={width - itemsWidth - 2}
          y={2}
          width={itemsWidth}
          height={itemsHeight}
          fill={bgColor}
          fillOpacity={0.9}
          stroke={textColor}
          // strokeDasharray={"0, " + (itemsWidth + itemsHeight) + ", " + (itemsWidth + itemsHeight)}
        />
        <text
          fontSize={fontSize}
          fill={textColor}
          x={width - itemsWidth}
          y={fontSize}
          // alignmentBaseline="hanging"
          // textAnchor="start"
        >
          {nodeTotalNodes}
        </text>
      </g>
    );
  }
  return null;
};

const Node: React.FunctionComponent<NodeProps> = ({
  bgColor,
  fontSize,
  globalTotalNodes,
  hasChildren,
  height,
  hideNumberOfChildren,
  hideValue,
  id,
  isSelectedNode,
  label,
  nodeTotalNodes,
  onClick,
  textColor,
  treemapId,
  url,
  valueUnit,
  valueWithFormat,
  width,
  x0,
  x1,
  xScaleFactor,
  xScaleFunction,
  xTranslated,
  y0,
  y1,
  yScaleFactor,
  yScaleFunction,
  yTranslated,
  zoomEnabled
}) => {
  const currentXTranslated =
    xTranslated !== undefined
      ? xTranslated
      : zoomEnabled === true
      ? xScaleFunction(x0)
      : x0;
  const currentYTranslated =
    yTranslated !== undefined
      ? yTranslated
      : zoomEnabled === true
      ? yScaleFunction(y0)
      : y0;
  const currentWidth = width !== undefined ? width : xScaleFactor * (x1 - x0);
  const currentHeight =
    height !== undefined ? height : yScaleFactor * (y1 - y0);

  const cursor =
    hasChildren === true && isSelectedNode === false ? "pointer" : "auto";
  const itemsWidth = getNumberItemsWidthByNumberOfChars(
    fontSize,
    nodeTotalNodes.toString().length
  );
  const clipWidth =
    currentWidth > itemsWidth ? currentWidth - itemsWidth : currentWidth;
  return (
    <g
      transform={`translate(${currentXTranslated},${currentYTranslated})`}
      className={
        styles.node +
        " " +
        (nodeTotalNodes === globalTotalNodes ? styles.rootNode : null)
      }
      id={id.toString()}
      onClick={hasChildren ? onClick : null}
      style={{ cursor }}
    >
      <rect
        id={"rect-" + id}
        width={currentWidth}
        height={currentHeight}
        fill={bgColor}
      />
      <clipPath id={"clip-".concat(treemapId, "-", id.toString())}>
        <rect width={Math.max(0, clipWidth - 5)} height={currentHeight} />
      </clipPath>
      <a href={url} target="_blank">
        <text
          clipPath={"url(#clip-".concat(treemapId, "-", id.toString(), ")")}
        >
          <LabelNewLine
            label={label}
            textColor={textColor}
            fontSize={fontSize}
            valueWithFormat={valueWithFormat}
            valueUnit={valueUnit}
            hasChildren={hasChildren}
            hideValue={hideValue}
          />
        </text>
      </a>
      {!hideNumberOfChildren && (
        <NumberOfItemsRect
          bgColor={bgColor}
          name={name}
          width={currentWidth}
          height={currentHeight}
          fontSize={fontSize}
          textColor={textColor}
          nodeTotalNodes={nodeTotalNodes}
        />
      )}
      <title>
        {label +
          "\n" +
          valueWithFormat +
          " " +
          valueUnit +
          "\n" +
          nodeTotalNodes +
          "/" +
          globalTotalNodes}
      </title>
    </g>
  );
};

export default Node;
