import { HierarchyRectangularNode } from "d3-hierarchy";
export interface ITreeMapState {
    scopedNodes: HierarchyRectangularNode<{}>[];
    data: any;
    width: number;
    height: number;
    xScaleFactor: number;
    yScaleFactor: number;
    xScaleFunction: any;
    yScaleFunction: any;
    zoomEnabled: boolean;
    breadCrumbItems: any;
    selectedId: any;
    selectedNode: HierarchyRectangularNode<{}>;
    totalNodes: number;
    selectedNodeTotalNodes: number;
};
