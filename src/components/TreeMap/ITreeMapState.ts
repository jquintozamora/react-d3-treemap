import { ScaleLinear } from "d3-scale";
import { IBreadcrumbItem } from "../Breadcrumb";
import { CustomHierarchyRectangularNode } from "./TreeMap";
export interface ITreeMapState<TreeMapInputData> {
  data: TreeMapInputData;
  width: number;
  height: number;
  xScaleFunction: ScaleLinear<number, number>;
  yScaleFunction: ScaleLinear<number, number>;
  breadcrumbItems: IBreadcrumbItem[];
  selectedId: number;
  selectedNode: CustomHierarchyRectangularNode<TreeMapInputData>;
}
