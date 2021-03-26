import { ScaleLinear } from "d3-scale";
import { IBreadcrumbItem } from "../Breadcrumb";
import { CustomHierarchyRectangularNode } from "./TreeMap";
export interface ITreeMapState<TreeMapInputData> {
  data: TreeMapInputData;
  width: number;
  height: number;
  xScaleFactor: number;
  yScaleFactor: number;
  xScaleFunction: ScaleLinear<number, number>;
  yScaleFunction: ScaleLinear<number, number>;
  zoomEnabled: boolean;
  breadcrumbItems: IBreadcrumbItem[];
  selectedId: number;
  selectedNode: CustomHierarchyRectangularNode<TreeMapInputData>;
}
