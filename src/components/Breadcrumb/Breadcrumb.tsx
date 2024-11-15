import "./Breadcrumb.css"

import * as React from "react"
import classnames from "classnames"
import { BaseTreeMapInPutData } from "../TreeMap/types"
import { HierarchyRectangularNode } from "d3-hierarchy"

export interface BreadcrumbProps<TreeMapInputData> {
  originalTopNode: HierarchyRectangularNode<TreeMapInputData>
  selectedNodeId: number
  className?: string
  zoomTo: (nodeId: number) => void
  namePropInData: string
}

export interface BreadcrumbItem {
  /**
   * Text to display to the user for the breadcrumb
   */
  text: string
  /**
   * Arbitrary unique string associated with the breadcrumb
   */
  key: number
  /**
   * Callback issued when the breadcrumb is selected.
   */
  onClick?: (ev?: React.MouseEvent<HTMLElement>, item?: BreadcrumbItem) => void
}

export const Breadcrumb = <TreeMapInputData extends BaseTreeMapInPutData>({
  className,
  originalTopNode,
  selectedNodeId,
  zoomTo,
  namePropInData,
}: BreadcrumbProps<TreeMapInputData>) => {
  const selectedNodeFromOriginalTree = originalTopNode
    .descendants()
    .filter((n: HierarchyRectangularNode<TreeMapInputData>) => {
      return n.data.id === selectedNodeId
    })
    .pop()

  const items = originalTopNode
    .path(selectedNodeFromOriginalTree)
    .map(({ data }: HierarchyRectangularNode<TreeMapInputData>) => {
      return {
        text: data[namePropInData],
        key: data.id,
        onClick: data.id !== selectedNodeId ? () => zoomTo(data.id) : undefined,
      }
    })

  const itemsFinal =
    items && items.length
      ? items
      : [{ text: originalTopNode.data[namePropInData], key: 0 }]

  return (
    <div className={classnames("TreeMap__breadcrumb", className)}>
      {itemsFinal.map((item: BreadcrumbItem, index: number) => (
        <div key={index}>
          <a
            className="TreeMap__breadcrumbItem"
            key={item.key}
            id={`${item.key}`}
            onClick={item.onClick ? item.onClick : undefined}
            style={{ cursor: item.onClick ? "pointer" : "auto" }}
          >
            {item.text}
          </a>
          {index < itemsFinal.length - 1 ? (
            <span className="TreeMap__breadcrumbSeparator">/</span>
          ) : null}
        </div>
      ))}
    </div>
  )
}
