import { treemap, hierarchy, treemapSquarify } from "d3-hierarchy"
import { CustomHierarchyRectangularNode } from "./TreeMap"
import React from "react"

interface TreeMapContext<TreeMapInputData> {
  width: number
  height: number
  data: TreeMapInputData
  valuePropInData: string
}

export const useTreeMap = <TreeMapInputData>({
  width,
  height,
  data,
  valuePropInData,
}: TreeMapContext<TreeMapInputData>): CustomHierarchyRectangularNode<TreeMapInputData> => {
  const nodes = React.useMemo(() => {
    const d3TreeMap = treemap<TreeMapInputData>()
      .tile(treemapSquarify.ratio(1))
      .size([width, height])
      .round(true)
      .paddingTop((node) => {
        if (node.depth > 2) {
          return 3
        }
        if (node.depth > 1) {
          return 7
        }
        return 19
      })(
      hierarchy(data)
        .sum((s) => s[valuePropInData])
        .sort((a, b) => b[valuePropInData] - a[valuePropInData])
    )

    let numberItemId = 0
    return d3TreeMap.each(
      (item: CustomHierarchyRectangularNode<TreeMapInputData>) => {
        item.customId = numberItemId++
      }
    ) as CustomHierarchyRectangularNode<TreeMapInputData>
  }, [data, height, valuePropInData, width])

  return nodes
}
