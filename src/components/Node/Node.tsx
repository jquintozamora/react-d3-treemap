import "./Node.css";

import * as React from "react";
import classnames from "classnames";

export interface NodeProps {
  /*
        HierarchyRectangularNode properties
    */
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;

  bgColor: string;
  className?: string;
  fontSize: number;
  globalTotalNodes: number;
  hasChildren: boolean;
  height?: number;
  hideNumberOfChildren?: boolean;
  id: number;
  isSelectedNode: boolean;
  label: string;
  name: string;
  nodeTotalNodes: number;
  onClick?: any;
  style?: object;
  textColor: string;
  treemapId?: string;
  url: string;
  value: string;
  width?: number;
  xScaleFactor?: number;
  xScaleFunction?: any;
  xTranslated?: number;
  yScaleFactor?: number;
  yScaleFunction?: any;
  yTranslated?: number;
  zoomEnabled?: boolean;
}

const getNumberItemsWidthByNumberOfChars = (
  fontSize: number,
  numberOfChars: number
) => {
  return (fontSize / 2) * numberOfChars + 5;
};

const LabelNewLine = ({ label, textColor, fontSize, value, hasChildren }) => {
  if (!label) {
    return null;
  }

  if (hasChildren === true) {
    const fullLabel = value ? `${label}\xa0${value}` : label;
    return (
      <tspan fontSize={fontSize} fill={textColor} dx={4} dy={fontSize}>
        {fullLabel}
      </tspan>
    );
  } else {
    const fullLabel = value
      ? label.split(/(?=[A-Z][^A-Z])/g).concat(value)
      : label.split(/(?=[A-Z][^A-Z])/g);
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
  className,
  fontSize,
  globalTotalNodes,
  hasChildren,
  height,
  hideNumberOfChildren,
  id,
  isSelectedNode,
  label,
  nodeTotalNodes,
  onClick,
  textColor,
  treemapId,
  url,
  value,
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
      id={id.toString()}
      onClick={hasChildren ? onClick : null}
      style={{ cursor }}
    >
      <rect
        id={"rect-" + id}
        width={currentWidth}
        height={currentHeight}
        fill={bgColor}
        className={classnames("Node", className)}
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
            value={value}
            hasChildren={hasChildren}
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
        {`${label}\n${value}\n${nodeTotalNodes}/${globalTotalNodes}`}
      </title>
    </g>
  );
};

export default Node;
