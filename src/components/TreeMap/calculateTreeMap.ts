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
  paddingOuter: number
  paddingInner: number
}

export const calculateTreeMap = <TreeMapInputData>({
  width,
  height,
  data,
  valuePropInData,
  paddingOuter,
  paddingInner,
}: TreeMapContext<TreeMapInputData>): HierarchyRectangularNode<TreeMapInputData> =>
  treemap<TreeMapInputData>()
    .tile(treemapSquarify.ratio(1))
    .size([width, height])
    .round(true)
    .paddingOuter(paddingOuter)
    .paddingInner(paddingInner)
    .paddingTop(22)(
    hierarchy(data)
      .sum((s) => s[valuePropInData])
      .sort((a, b) => b[valuePropInData] - a[valuePropInData])
  )
