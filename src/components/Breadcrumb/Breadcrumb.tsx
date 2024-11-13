import "./Breadcrumb.css"

import * as React from "react"
import classnames from "classnames"
import { getTopParent } from "../TreeMap/helpers"
import {
  BaseTreeMapInPutData,
  CustomHierarchyRectangularNode,
} from "../TreeMap/TreeMap"

export interface BreadcrumbProps<TreeMapInputData> {
  /**
   * Collection of breadcrumbs to render
   */
  selectedNode: CustomHierarchyRectangularNode<TreeMapInputData>
  className?: string
  zoomTo: (nodeId: number) => void
  initialBreadcrumbItem: BreadcrumbItem
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
  selectedNode,
  zoomTo,
  initialBreadcrumbItem,
}: BreadcrumbProps<TreeMapInputData>) => {
  const items = getTopParent(selectedNode)
    .path(selectedNode)
    .map(
      ({
        data,
        customId,
      }: CustomHierarchyRectangularNode<TreeMapInputData>) => {
        return {
          text: data["name"],
          key: customId,
          onClick:
            customId !== selectedNode.customId
              ? () => zoomTo(Number(customId))
              : undefined,
        }
      }
    )

  const itemsFinal = items && items.length ? items : [initialBreadcrumbItem]

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
