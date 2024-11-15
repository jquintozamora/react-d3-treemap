import * as React from "react"
import { getNumberItemsWidthByNumberOfChars } from "../helpers"

export enum NumberOfChildrenPlacement {
  TopRight,
  BottomRight,
}

interface NumberOfChildrenProps {
  id: number
  width: number
  height: number
  textColor: string
  borderColor: string
  bgColor: string
  nodeTotalNodes: number
  isSelectedNode: boolean
  placement: NumberOfChildrenPlacement
  style: React.CSSProperties
}

const NumberOfChildren: React.FunctionComponent<NumberOfChildrenProps> = ({
  id,
  width,
  height,
  textColor,
  borderColor,
  bgColor,
  nodeTotalNodes,
  isSelectedNode,
  placement,
  style,
}) => {
  const realPlacement = isSelectedNode
    ? NumberOfChildrenPlacement.TopRight
    : placement

  const fontSize = Number(style.fontSize)
  const itemsWidth = getNumberItemsWidthByNumberOfChars(
    fontSize,
    nodeTotalNodes.toString().length
  )
  const itemHeightFactor = 2
  const itemsHeight = fontSize + itemHeightFactor
  const strokeDasharrayTotal = itemsWidth + itemsHeight
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
          id={`rectNumberItems-${id}`}
          x={width - itemsWidth}
          y={0.5}
          width={itemsWidth}
          height={itemsHeight}
          fill={bgColor}
          stroke={borderColor}
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
    )
  }
  return null
}

export default NumberOfChildren
