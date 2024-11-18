import "./Node.css"

import * as React from "react"
import classnames from "classnames"
import useTooltip from "../Tooltip/useTooltip"
import { Tooltip } from "../Tooltip/Tooltip"
import NumberOfChildren, { NumberOfChildrenPlacement } from "./NumberOfChildren"
import { getNumberItemsWidthByNumberOfChars } from "./helpers"
import LabelNewLine from "./LabelNewLine"

export interface NodeProps {
  /*
        HierarchyRectangularNode properties
    */
  x0?: number
  y0?: number
  x1?: number
  y1?: number

  bgColor: string
  borderColor: string
  textColorBorderColorBg: string
  textColor: string
  className?: string
  hasChildren: boolean
  id: number
  isSelectedNode: boolean
  label: string
  nodeTotalNodes: number
  numberOfChildrenPlacement: NumberOfChildrenPlacement
  onClickDrillDown?: (ev?: React.MouseEvent<SVGElement>) => void
  onClick?: (ev?: React.MouseEvent<SVGElement>) => void
  onClickBack?: (ev?: React.MouseEvent<SVGElement>) => void
  style?: React.CSSProperties
  treemapId?: string
  url: string
  value: string
  splitRegExp?: RegExp
}

const Node: React.FunctionComponent<NodeProps> = ({
  bgColor,
  borderColor,
  textColorBorderColorBg,
  className,
  hasChildren,
  id,
  isSelectedNode,
  label,
  nodeTotalNodes,
  onClick,
  onClickBack,
  onClickDrillDown,
  textColor,
  treemapId,
  url,
  value,
  x0,
  x1,
  y0,
  y1,
  style,
  numberOfChildrenPlacement,
  splitRegExp,
}) => {
  const currentXTranslated = Math.max(0, x0)
  const currentYTranslated = Math.max(0, y0)
  const currentWidth = Math.max(0, x1 - x0)
  const currentHeight = Math.max(0, y1 - y0)

  const fontSize = Number(style.fontSize)
  const itemsWidth = getNumberItemsWidthByNumberOfChars(
    fontSize,
    nodeTotalNodes.toString().length
  )
  const showNumberOfItems =
    !(numberOfChildrenPlacement === NumberOfChildrenPlacement.None) &&
    hasChildren

  const nodePaddingTop = !isNaN(style.paddingTop as number)
    ? Number(style.paddingTop)
    : 2
  const nodePaddingLeft = !isNaN(style.paddingLeft as number)
    ? Number(style.paddingLeft)
    : 5
  const nodePaddingRight = !isNaN(style.paddingRight as number)
    ? Number(style.paddingRight)
    : 5
  const paddedCurrentWidth = currentWidth - nodePaddingLeft - nodePaddingRight
  const clipWidth = Math.max(
    0,
    showNumberOfItems &&
      numberOfChildrenPlacement === NumberOfChildrenPlacement.TopRight
      ? paddedCurrentWidth - itemsWidth
      : paddedCurrentWidth
  )

  const { hideTooltip, showTooltip, disableTooltip } = useTooltip()

  const handleMouseMove = React.useCallback(
    (ev: React.MouseEvent) => {
      showTooltip(<Tooltip label={label} value={value} />, ev)
    },
    [label, showTooltip, value]
  )

  const handleMouseLeave = React.useCallback(() => {
    hideTooltip()
  }, [hideTooltip])

  const extraPadding = onClickBack || onClickDrillDown ? 20 : 0

  return (
    <g
      onMouseEnter={disableTooltip ? undefined : handleMouseMove}
      onMouseLeave={disableTooltip ? undefined : handleMouseLeave}
      onMouseMove={disableTooltip ? undefined : handleMouseMove}
      transform={`translate(${currentXTranslated},${currentYTranslated})`}
      id={`${id}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "auto" }}
    >
      <rect
        id={`rect-${id}`}
        width={currentWidth}
        height={currentHeight}
        className={classnames("Node", className)}
        style={{
          fill: bgColor,
          stroke: borderColor,
          ...style,
        }}
      />
      {onClickBack ? (
        <g
          style={{ cursor: "pointer" }}
          onClick={onClickBack}
          transform={`translate(${nodePaddingLeft},${nodePaddingTop}) scale(0.55)`}
        >
          <path
            xmlns="http://www.w3.org/2000/svg"
            fill={textColor}
            d="M26.105,21.891c-0.229,0-0.439-0.131-0.529-0.346l0,0c-0.066-0.156-1.716-3.857-7.885-4.59   c-1.285-0.156-2.824-0.236-4.693-0.25v4.613c0,0.213-0.115,0.406-0.304,0.508c-0.188,0.098-0.413,0.084-0.588-0.033L0.254,13.815   C0.094,13.708,0,13.528,0,13.339c0-0.191,0.094-0.365,0.254-0.477l11.857-7.979c0.175-0.121,0.398-0.129,0.588-0.029   c0.19,0.102,0.303,0.295,0.303,0.502v4.293c2.578,0.336,13.674,2.33,13.674,11.674c0,0.271-0.191,0.508-0.459,0.562   C26.18,21.891,26.141,21.891,26.105,21.891z"
          />
          <path fill="transparent" d="M0 0h32v32H0z" />
        </g>
      ) : null}
      {onClickDrillDown ? (
        <g
          style={{ cursor: "pointer" }}
          onClick={onClickDrillDown}
          transform={`translate(${nodePaddingLeft},${nodePaddingTop}) scale(0.55)`}
        >
          <rect />
          <path
            fill={textColor}
            d="m10 6 1.4-1.4L15 8.2V0h2v8.2l3.6-3.6L22 6l-6 6-6-6z"
          />
          <path
            fill={textColor}
            d="M22 16a6 6 0 0 0-1.8-4.2L16 16l-4.2-4.2A6 6 0 1 0 22 16Z"
          />
          <path
            fill={textColor}
            d="M30 16a14 14 0 0 0-4.1-9.9l-1.4 1.4a12 12 0 1 1-17 0L6.1 6.1A14 14 0 1 0 30 16Z"
          />
          <path fill="transparent" d="M0 0h32v32H0z" />
        </g>
      ) : null}
      <clipPath id={`clip-${treemapId}-${id}`}>
        <rect width={clipWidth} height={currentHeight} />
      </clipPath>
      <a
        className={classnames({ Node__link: !!url })}
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        <text
          clipPath={`url(#clip-${treemapId}-${id})`}
          fill={textColor}
          transform={`translate(${
            nodePaddingLeft + extraPadding
          },${nodePaddingTop})`}
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
            value={value}
            hasChildren={hasChildren}
            containerWidth={clipWidth}
            containerHeight={currentHeight}
            style={style}
            splitRegExp={splitRegExp}
          />
        </text>
      </a>
      {showNumberOfItems && (
        <NumberOfChildren
          id={id}
          width={currentWidth}
          height={currentHeight}
          style={style}
          textColor={textColorBorderColorBg}
          borderColor={borderColor}
          bgColor={borderColor}
          nodeTotalNodes={nodeTotalNodes}
          isSelectedNode={isSelectedNode}
          placement={numberOfChildrenPlacement}
        />
      )}
    </g>
  )
}

export default Node
