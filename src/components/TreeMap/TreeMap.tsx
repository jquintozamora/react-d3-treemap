import * as React from "react"
import classnames from "classnames"

import { HierarchyRectangularNode } from "d3-hierarchy"
import { scaleLinear, scaleSequential } from "d3-scale"
import { interpolateSpectral } from "d3-scale-chromatic"

import Node, { NumberOfChildrenPlacement } from "../Node"
import Breadcrumb from "../Breadcrumb"
import { TreeMapProps, ColorModel } from "./TreeMapProps"
import TooltipProvider from "../Tooltip/TooltipProvider"
import { getColorsFromNode, getTopParent, getValueFormatFn } from "./helpers"
import { useTreeMap } from "./useTreeMap"

export interface BaseTreeMapInPutData {
  name: string
  value?: number
  children?: Array<BaseTreeMapInPutData>
  className?: string
}

export interface CustomHierarchyRectangularNode<TreeMapInputData>
  extends HierarchyRectangularNode<TreeMapInputData> {
  customId: number
}

const TreeMap = <TreeMapInputData extends BaseTreeMapInPutData>(
  props: React.PropsWithChildren<TreeMapProps<TreeMapInputData>>
) => {
  const {
    id = "myTreeMap",
    data = null,
    height = 600,
    width = 600,
    valueFormat = ",d",
    disableBreadcrumb = false,
    colorModel = ColorModel.OneEachChildren,
    paddingInner = 0,
    customD3ColorScale = scaleSequential(interpolateSpectral),
    namePropInData = "name",
    linkPropInData = "link",
    valuePropInData = "value", // can be value, count, ...
    childrenPropInData = "children",
    numberOfChildrenPlacement = NumberOfChildrenPlacement.BottomRight,
    darkNodeTextColor = "white",
    darkNodeBorderColor = "white",
    lightNodeTextColor = "black",
    lightNodeBorderColor = "black",
    disableTooltip = false,
    tooltipOffsetX = 0,
    tooltipOffsetY = 0,
    levelsToDisplay = 1,
    svgClassName,
    svgStyle,
    className,
    breadCrumbClassName,
    tooltipPlacement,
    tooltipClassName,
    valueFn,
    splitRegExp,
    hideNumberOfChildren,
    hideValue,
    nodeClassName,
    nodeStyle,
    onZoom,
    valueUnit,
  } = props

  const topNode = useTreeMap({
    width,
    height,
    data,
    valuePropInData,
  })
  const [selectedNode, setSelectedNode] = React.useState(topNode)

  const zoomTo = React.useCallback(
    (nodeId: number) => {
      const currentNode = getTopParent(selectedNode)
        .descendants()
        .filter((item: CustomHierarchyRectangularNode<TreeMapInputData>) => {
          return item.customId.toString() === nodeId.toString()
        })
        .pop()
      if (currentNode) {
        if (onZoom) {
          onZoom(currentNode.depth, nodeId, currentNode)
        }
        setSelectedNode(currentNode)
      } else {
        console.warn("No node found for " + nodeId)
      }
    },
    [onZoom, selectedNode]
  )

  const renderNode = React.useCallback(
    (node: CustomHierarchyRectangularNode<TreeMapInputData>) => {
      const { customId, data, x0, x1, y0, y1 } = node

      const name = data[namePropInData]
      const url = data[linkPropInData]
      const nodeClassNameFromData = data["className"]

      const hasChildren =
        node[childrenPropInData] && node[childrenPropInData].length > 0
          ? true
          : false
      let formatted = node[valuePropInData]
      try {
        formatted = getValueFormatFn(
          valueFn,
          valueFormat
        )(node[valuePropInData])
      } catch (e) {
        console.warn(e)
      }
      const formattedValue = `(${formatted}${valueUnit ? ` ${valueUnit}` : ""})`

      const nodeTotalNodes = node.descendants().length - 1

      const { bgColor, textColor, borderColor, textColorBorderColorBg } =
        getColorsFromNode({
          node,
          childrenPropInData,
          data,
          colorModel,
          customD3ColorScale,
          valuePropInData,
          nodeTotalNodes,
          defaultColors: {
            darkNodeTextColor,
            darkNodeBorderColor,
            lightNodeTextColor,
            lightNodeBorderColor,
          },
        })

      const isSelectedNode = customId === selectedNode.customId

      const xScaleFunction = scaleLinear()
        .range([0, width])
        .domain([selectedNode.x0, selectedNode.x1])
      const yScaleFunction = scaleLinear()
        .range([0, height])
        .domain([selectedNode.y0, selectedNode.y1])

      console.log("node", selectedNode)
      return (
        <Node
          bgColor={bgColor}
          textColor={textColor}
          borderColor={borderColor}
          textColorBorderColorBg={textColorBorderColorBg}
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
          onClick={!isSelectedNode ? () => zoomTo(customId) : undefined}
          treemapId={id}
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
      )
    },
    [
      childrenPropInData,
      colorModel,
      customD3ColorScale,
      darkNodeBorderColor,
      darkNodeTextColor,
      height,
      hideNumberOfChildren,
      hideValue,
      id,
      lightNodeBorderColor,
      lightNodeTextColor,
      linkPropInData,
      namePropInData,
      nodeClassName,
      nodeStyle,
      numberOfChildrenPlacement,
      paddingInner,
      selectedNode,
      splitRegExp,
      valueFn,
      valueFormat,
      valuePropInData,
      valueUnit,
      width,
      zoomTo,
    ]
  )

  const reactNodes = React.useMemo(() => {
    let nodes: Array<React.ReactNode> = []
    const maxLevel = selectedNode.depth === 0 ? levelsToDisplay : 1
    const iterateAllChildren = (
      mainNode: CustomHierarchyRectangularNode<TreeMapInputData>,
      level: number
    ) => {
      nodes = nodes.concat(renderNode(mainNode))

      if (level < maxLevel) {
        if (
          childrenPropInData in mainNode &&
          mainNode[childrenPropInData].length > 0
        ) {
          mainNode[childrenPropInData].forEach(
            (element: CustomHierarchyRectangularNode<TreeMapInputData>) => {
              iterateAllChildren(element, level + 1)
            }
          )
        }
      }
    }
    iterateAllChildren(selectedNode, 0)
    return nodes
  }, [childrenPropInData, levelsToDisplay, renderNode, selectedNode])

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
            selectedNode={selectedNode}
            zoomTo={zoomTo}
            initialBreadcrumbItem={{ text: data[namePropInData], key: 0 }}
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
  )
}

export default TreeMap
