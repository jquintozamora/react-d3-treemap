import "./Node.css";

import * as React from "react";
import classnames from "classnames";
import { ScaleLinear } from "d3-scale";

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
  globalTotalNodes: number;
  hasChildren: boolean;
  height?: number;
  hideNumberOfChildren?: boolean;
  id: number;
  isSelectedNode: boolean;
  label: string;
  name: string;
  nodeTotalNodes: number;
  onClick?: (ev?: React.MouseEvent<SVGElement>) => void;
  style?: React.CSSProperties;
  textColor: string;
  treemapId?: string;
  url: string;
  value: string;
  width?: number;
  xScaleFactor?: number;
  xScaleFunction?: ScaleLinear<number, number>;
  xTranslated?: number;
  yScaleFactor?: number;
  yScaleFunction?: ScaleLinear<number, number>;
  yTranslated?: number;
  zoomEnabled?: boolean;
  numberOfChildrenPlacement: NumberOfChildrenPlacement;
}

export enum NumberOfChildrenPlacement {
  TopRight,
  BottomRight,
}

const getNumberItemsWidthByNumberOfChars = (
  fontSize: number,
  numberOfChars: number
) => {
  return (fontSize / 2) * numberOfChars + 5;
};

let canvas;
const getTextWidth = (
  text,
  style: React.CSSProperties = {
    fontVariant: "normal",
    fontWeight: "normal",
    fontSize: 14,
    fontFamily: "Arial",
  }
) => {
  // re-use canvas object for better performance
  if (!canvas) {
    canvas = document.createElement("canvas");
  }
  var context = canvas.getContext("2d");
  const { fontVariant, fontWeight, fontSize, fontFamily } = style;
  if (context) {
    context.font = `${fontVariant} ${fontWeight} ${fontSize}px '${fontFamily}'`;
    return {
      width: context.measureText(text).width,
      height: fontSize,
    };
  } else {
    return { width: 0, height: fontSize };
  }
};

const charWidthCache: Record<string, number> = {};
const truncateText = (
  text: string,
  style: React.CSSProperties,
  maxWidth: number,
  ellipsis: string = "..."
) => {
  const cachedCharWidth = (char: string) => {
    const cached = charWidthCache[char];
    if (cached !== undefined) {
      return cached;
    }
    const charWidth = getTextWidth(char, style).width;
    charWidthCache[char] = charWidth;
    return charWidth;
  };

  const truncatedChars: string[] = [];
  const charArray = Array.from(text);

  const ellipsisWidth = cachedCharWidth(ellipsis);
  if (maxWidth - ellipsisWidth < 0) {
    return text.charAt(0);
  }

  let currentWidth = ellipsisWidth;
  let didTruncate = false;
  for (let i = 0; i < charArray.length; i++) {
    const charWidth = cachedCharWidth(charArray[i]);
    if (currentWidth + charWidth <= maxWidth) {
      truncatedChars[i] = charArray[i];
      currentWidth += charWidth;
    } else {
      truncatedChars[i] = ellipsis;
      didTruncate = true;
      break;
    }
  }

  if (didTruncate) {
    return truncatedChars.join("");
  }

  return text;
};

const LabelNewLine = ({
  label,
  textColor,
  fontSize,
  value,
  hasChildren,
  containerWidth,
  style,
}) => {
  if (!label) {
    return null;
  }

  const fullLabel = value ? `${label}\xa0${value}` : label;
  const splitLabel =
    getTextWidth(fullLabel, style).width >= containerWidth || !hasChildren
      ? label.split(/(?=[A-Z/a-z0-9.][^A-Z/a-z0-9.])/g).concat(value)
      : [fullLabel];

  return splitLabel.map((item: string, index) => {
    return (
      <tspan
        fontSize={fontSize}
        fill={textColor}
        key={index}
        x={0}
        dy={fontSize}
      >
        {truncateText(item, style, containerWidth)}
      </tspan>
    );
  });
};

const NumberOfChildren = ({
  name,
  width,
  height,
  textColor,
  nodeTotalNodes,
  isSelectedNode,
  placement,
  style,
}) => {
  const realPlacement = isSelectedNode
    ? NumberOfChildrenPlacement.TopRight
    : placement;

  const fontSize = Number(style.fontSize);
  const itemsWidth = getNumberItemsWidthByNumberOfChars(
    fontSize,
    nodeTotalNodes.toString().length
  );
  const itemHeightFactor = 2;
  const itemsHeight = fontSize + itemHeightFactor;
  const strokeDasharrayTotal = itemsWidth + itemsHeight;
  if (width > itemsWidth && height > itemsHeight) {
    return (
      <g
        transform={`translate(0, ${
          realPlacement === NumberOfChildrenPlacement.BottomRight
            ? height - itemsHeight
            : 0
        })`}
      >
        <rect
          id={`rectNumberItems-${name}`}
          x={width - itemsWidth}
          y={0}
          width={itemsWidth}
          height={itemsHeight}
          fill="none"
          stroke={textColor}
          strokeDasharray={`${
            realPlacement === NumberOfChildrenPlacement.BottomRight
              ? itemsWidth
              : 0
          },${strokeDasharrayTotal},${strokeDasharrayTotal}`}
        />
        <text
          fill={textColor}
          x={width - itemsWidth + itemsWidth / 2}
          y={itemsHeight - itemHeightFactor}
          textAnchor="middle"
          style={{
            fontVariant: style.fontVariant,
            fontWeight: style.fontWeight,
            fontSize: style.fontSize,
            fontFamily: style.fontFamily,
          }}
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
  style,
  numberOfChildrenPlacement,
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

  const fontSize = Number(style.fontSize);
  const itemsWidth = getNumberItemsWidthByNumberOfChars(
    fontSize,
    nodeTotalNodes.toString().length
  );
  const showNumberOfItems = !hideNumberOfChildren && hasChildren;

  const paddedCurrentWidth =
    currentWidth -
    (Number(style.paddingLeft) || 0) -
    (Number(style.paddingRight) || 4);
  const clipWidth = Math.max(
    0,
    showNumberOfItems &&
      numberOfChildrenPlacement === NumberOfChildrenPlacement.TopRight
      ? paddedCurrentWidth - itemsWidth
      : paddedCurrentWidth
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
          ...style,
        }}
      />
      <clipPath id={`clip-${treemapId}-${id}`}>
        <rect width={clipWidth} height={currentHeight} />
      </clipPath>
      <a
        className={classnames({ Node__link: !!url })}
        href={url}
        target="_blank"
      >
        <text
          clipPath={`url(#clip-${treemapId}-${id})`}
          transform={`translate(${style.paddingLeft || 0},${
            style.paddingTop || 0
          })`}
          style={{
            fontVariant: style.fontVariant,
            fontWeight: style.fontWeight,
            fontSize: style.fontSize,
            fontFamily: style.fontFamily,
          }}
        >
          <LabelNewLine
            label={label}
            textColor={textColor}
            fontSize={fontSize}
            value={value}
            hasChildren={hasChildren}
            containerWidth={clipWidth}
            style={style}
          />
        </text>
      </a>
      {showNumberOfItems && (
        <NumberOfChildren
          name={name}
          width={currentWidth}
          height={currentHeight}
          style={style}
          textColor={textColor}
          nodeTotalNodes={nodeTotalNodes}
          isSelectedNode={isSelectedNode}
          placement={numberOfChildrenPlacement}
        />
      )}
      <title>
        {`${label}\n${value}\n${nodeTotalNodes}/${globalTotalNodes}`}
      </title>
    </g>
  );
};

export default Node;
