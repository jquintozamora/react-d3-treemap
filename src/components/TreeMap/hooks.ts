import { treemap, hierarchy, treemapSquarify } from "d3-hierarchy";
import { CustomHierarchyRectangularNode } from "./TreeMap";

interface TreeMapContext<TreeMapInputData> {
  width: number;
  height: number;
  data: TreeMapInputData;
  valuePropInData: string;
  paddingOuter: number;
}

// Todo. useMemo once TreeMap is refactored to functional component
export const useTreeMap = <TreeMapInputData>({
  width,
  height,
  data,
  valuePropInData,
  paddingOuter,
}: TreeMapContext<TreeMapInputData>): CustomHierarchyRectangularNode<TreeMapInputData> => {
  const d3TreeMap = treemap<TreeMapInputData>()
    .tile(treemapSquarify.ratio(1))
    .size([width, height])
    .round(true)
    .paddingOuter((node) => {
      if (node.depth > 2) {
        return 1;
      }
      if (node.depth > 1) {
        return 2;
      }
      return paddingOuter;
    })
    .paddingTop((node) => {
      if (node.depth > 2) {
        return 3;
      }
      if (node.depth > 1) {
        return 7;
      }
      return 19;
    })(
    hierarchy(data)
      .sum((s) => s[valuePropInData])
      .sort((a, b) => b[valuePropInData] - a[valuePropInData])
  );

  let numberItemId = 0;
  const customNodes = d3TreeMap.each(
    (item: CustomHierarchyRectangularNode<TreeMapInputData>) => {
      item.customId = numberItemId++;
    }
  ) as CustomHierarchyRectangularNode<TreeMapInputData>;

  return customNodes;
};
