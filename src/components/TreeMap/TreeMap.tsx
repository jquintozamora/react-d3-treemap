import * as React from "react"
import classnames from "classnames"
import { scaleLinear, scaleSequential } from "d3-scale"
import { interpolateSpectral } from "d3-scale-chromatic"

import Node, { NumberOfChildrenPlacement } from "../Node"
import Breadcrumb from "../Breadcrumb"
import { TreeMapProps, ColorModel } from "./TreeMapProps"
import TooltipProvider from "../Tooltip/TooltipProvider"
import { getColorsFromNode, getValueFormatFn } from "./helpers"
import { calculateTreeMap } from "./calculateTreeMap"
import { BaseTreeMapInPutData, NodeColorsLookup } from "./types"
import { HierarchyRectangularNode } from "d3-hierarchy"

const TreeMap = <TreeMapInputData extends BaseTreeMapInPutData>(
  props: React.PropsWithChildren<TreeMapProps<TreeMapInputData>>
) => {
  const {
    id: treemapId = "myTreeMap",
    data = null,
    height = 600,
    width = 600,
    valueFormat = ",d",
    disableBreadcrumb = false,
    colorModel = ColorModel.OneEachChildren,
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
    paddingOuter = 1,
    paddingInner = 1,
  } = props

  const originalTopNode = React.useMemo<
    HierarchyRectangularNode<TreeMapInputData>
  >(
    () =>
      calculateTreeMap({
        width,
        height,
        data,
        valuePropInData,
        paddingOuter,
        paddingInner,
      }) as HierarchyRectangularNode<TreeMapInputData>,
    [data, height, paddingInner, paddingOuter, valuePropInData, width]
  )

  const originalTopNodeColorsLookup = React.useMemo(() => {
    const lookup: NodeColorsLookup = {}
    originalTopNode.each((node: HierarchyRectangularNode<TreeMapInputData>) => {
      lookup[node.data.id] = getColorsFromNode({
        node,
        originalTopNode,
        childrenPropInData,
        colorModel,
        customD3ColorScale,
        valuePropInData,
        darkNodeTextColor,
        darkNodeBorderColor,
        lightNodeTextColor,
        lightNodeBorderColor,
      })
    })
    return lookup
  }, [
    childrenPropInData,
    colorModel,
    customD3ColorScale,
    darkNodeBorderColor,
    darkNodeTextColor,
    lightNodeBorderColor,
    lightNodeTextColor,
    originalTopNode,
    valuePropInData,
  ])

  const [selectedNode, setSelectedNode] = React.useState(originalTopNode)

  const zoomTo = React.useCallback(
    (nodeId: number) => {
      // selectedNode is a subtree where parent is null, but nodeId could be any element
      // for the whole original tree
      const currentNode = originalTopNode
        .descendants()
        .filter((item: HierarchyRectangularNode<TreeMapInputData>) => {
          return item.data.id === nodeId
        })
        .pop()

      if (currentNode && "data" in currentNode && currentNode.data) {
        if (onZoom) {
          onZoom(currentNode)
        }
        setSelectedNode(
          calculateTreeMap({
            width,
            height,
            data: currentNode.data,
            valuePropInData,
            paddingOuter,
            paddingInner,
          })
        )
      } else {
        console.warn("No node found for " + currentNode.name)
      }
    },
    [
      height,
      onZoom,
      originalTopNode,
      paddingInner,
      paddingOuter,
      valuePropInData,
      width,
    ]
  )

  const renderNode = React.useCallback(
    (node: HierarchyRectangularNode<TreeMapInputData>) => {
      const { data, x0, x1, y0, y1 } = node

      const id = data.id
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
        originalTopNodeColorsLookup[id]

      const isSelectedNode = id === selectedNode.data.id
      const selectedNodeFromOriginalTree = originalTopNode
        .descendants()
        .filter((n: HierarchyRectangularNode<TreeMapInputData>) => {
          return n.data.id === selectedNode.data.id
        })
        .pop()

      const xScaleFunction = scaleLinear()
        .range([0, width])
        .domain([selectedNode.x0, selectedNode.x1])
      const yScaleFunction = scaleLinear()
        .range([0, height])
        .domain([selectedNode.y0, selectedNode.y1])

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
          id={id}
          isSelectedNode={isSelectedNode}
          key={id}
          label={name}
          nodeTotalNodes={nodeTotalNodes}
          onClick={!isSelectedNode ? () => zoomTo(node.data.id) : undefined}
          onClickBack={
            isSelectedNode && selectedNodeFromOriginalTree.parent
              ? () => zoomTo(selectedNodeFromOriginalTree.parent.data.id)
              : undefined
          }
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
          // paddingInner={paddingInner}
          splitRegExp={splitRegExp}
        />
      )
    },
    [
      childrenPropInData,
      height,
      hideNumberOfChildren,
      hideValue,
      linkPropInData,
      namePropInData,
      nodeClassName,
      nodeStyle,
      numberOfChildrenPlacement,
      originalTopNode,
      originalTopNodeColorsLookup,
      selectedNode.data.id,
      selectedNode.x0,
      selectedNode.x1,
      selectedNode.y0,
      selectedNode.y1,
      splitRegExp,
      treemapId,
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
      mainNode: HierarchyRectangularNode<TreeMapInputData>,
      level: number
    ) => {
      nodes = nodes.concat(renderNode(mainNode))

      if (level < maxLevel) {
        if (
          childrenPropInData in mainNode &&
          mainNode[childrenPropInData].length > 0
        ) {
          mainNode[childrenPropInData].forEach(
            (element: HierarchyRectangularNode<TreeMapInputData>) => {
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
            originalTopNode={originalTopNode}
            selectedNodeId={selectedNode.data.id}
            zoomTo={zoomTo}
            className={breadCrumbClassName}
            namePropInData={namePropInData}
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
