import {
  treemap,
  hierarchy,
  treemapSquarify,
  HierarchyRectangularNode,
} from "d3-hierarchy"

interface TreeMapContext<TreeMapInputData> {
  width: number
  height: number
  data: TreeMapInputData
  valuePropInData: string
}

export const calculateTreeMap = <TreeMapInputData>({
  width,
  height,
  data,
  valuePropInData,
}: TreeMapContext<TreeMapInputData>): HierarchyRectangularNode<TreeMapInputData> =>
  treemap<TreeMapInputData>()
    .tile(treemapSquarify.ratio(1))
    .size([width, height])
    .round(true)
    .paddingTop(19)(
    hierarchy(data)
      .sum((s) => s[valuePropInData])
      .sort((a, b) => b[valuePropInData] - a[valuePropInData])
  )
