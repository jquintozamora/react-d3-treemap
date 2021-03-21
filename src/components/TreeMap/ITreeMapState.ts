import { IBreadcrumbItem } from "../Breadcrumb";
import { CustomHierarchyRectangularNode } from "./TreeMap";
export interface ITreeMapState<TreeMapInputData> {
  data: TreeMapInputData;
  width: number;
  height: number;
  xScaleFactor: number;
  yScaleFactor: number;
  xScaleFunction: any;
  yScaleFunction: any;
  zoomEnabled: boolean;
  breadcrumbItems: IBreadcrumbItem[];
  selectedId: number;
  selectedNode: CustomHierarchyRectangularNode<TreeMapInputData>;
  totalNodes: number;
}
