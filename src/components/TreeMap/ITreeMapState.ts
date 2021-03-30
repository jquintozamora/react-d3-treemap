import { ScaleLinear } from "d3-scale";
import { IBreadcrumbItem } from "../Breadcrumb";
import { CustomHierarchyRectangularNode } from "./TreeMap";
export interface ITreeMapState<TreeMapInputData> {
  width: number;
  height: number;
  xScaleFunction: ScaleLinear<number, number>;
  yScaleFunction: ScaleLinear<number, number>;
  breadcrumbItems: IBreadcrumbItem[];
  selectedNode: CustomHierarchyRectangularNode<TreeMapInputData>;
}
