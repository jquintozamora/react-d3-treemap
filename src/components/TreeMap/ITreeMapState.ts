import { CustomHierarchyRectangularNode } from "./TreeMap";
export interface ITreeMapState<TreeMapInputData> {
  scopedNodes: Array<CustomHierarchyRectangularNode<TreeMapInputData>>;
  data: TreeMapInputData;
  width: number;
  height: number;
  xScaleFactor: number;
  yScaleFactor: number;
  xScaleFunction: any;
  yScaleFunction: any;
  zoomEnabled: boolean;
  breadCrumbItems: any;
  selectedId: number;
  selectedNode: CustomHierarchyRectangularNode<TreeMapInputData>;
  totalNodes: number;
  selectedNodeTotalNodes: number;
}
