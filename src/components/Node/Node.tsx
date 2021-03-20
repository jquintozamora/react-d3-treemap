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
  style?: React.CSSProperties;
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
  const strokeDasharrayTotal = itemsWidth + itemsHeight;
  if (width > itemsWidth && height > itemsHeight) {
    return (
      <g>
        <rect
          id={`rectNumberItems-${name}`}
          x={width - itemsWidth}
          y={0}
          width={itemsWidth}
          height={itemsHeight + 2}
          fill="none"
          stroke={textColor}
          strokeDasharray={`0,${strokeDasharrayTotal},${strokeDasharrayTotal}`}
        />
        <text
          fontSize={fontSize}
          fill={textColor}
          x={width - itemsWidth + itemsWidth / 2}
          y={itemsHeight}
          textAnchor="middle"
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
  zoomEnabled,
  style
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
  const showNumberOfItems = !hideNumberOfChildren && hasChildren;

  const clipWidth = Math.max(
    0,
    showNumberOfItems ? currentWidth - itemsWidth : currentWidth
  );

  return (
    <g
      transform={`translate(${currentXTranslated},${currentYTranslated})`}
      id={`${id}`}
      onClick={hasChildren ? onClick : null}
      style={{ cursor }}
    >
      <rect
        id={`rect-${id}`}
        width={currentWidth}
        height={currentHeight}
        className={classnames("Node", className)}
        style={{
          fill: bgColor,
          stroke: textColor,
          ...style
        }}
      />
      <clipPath id={`clip-${treemapId}-${id}`}>
        <rect width={clipWidth} height={currentHeight} />
      </clipPath>
      <a href={url} target="_blank">
        <text clipPath={`url(#clip-${treemapId}-${id})`}>
          <LabelNewLine
            label={label}
            textColor={textColor}
            fontSize={fontSize}
            value={value}
            hasChildren={hasChildren}
          />
        </text>
      </a>
      {showNumberOfItems && (
        <NumberOfItemsRect
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
