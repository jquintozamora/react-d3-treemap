import { HierarchyRectangularNode } from "d3-hierarchy";
export interface INodeProps {

    /*
        HierarchyRectangularNode properties
    */
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    data: any;
    readonly depth: number;
    // readonly height: number;
    parent: HierarchyRectangularNode<any> | null;
    children?: Array<HierarchyRectangularNode<any>>;
    /**
     * Aggregated numeric value as calculated by sum(value) or count(),
     * if previously invoked.
     */
    readonly value?: number;
    /**
     * Optional Node Id string set by StratifyOperator, if
     * hierarchical data was created from tabular data using stratify()
     */
    // readonly id?: string;
    id: number;

    // Position props
    // x0: number;
    // y0: number;
    // x1: number;
    // y1: number;
    // depth: number;
    xScaleFactor: number;
    yScaleFactor: number;
    xScaleFunction: any;
    yScaleFunction: any;
    zoomEnabled: boolean;
    globalHeight: number;
    globalWidth: number;
    isSelectedNode: boolean;
    nodeTotalNodes: number;
    globalTotalNodes: number;

    xTranslated?: number;
    yTranslated?: number;
    width?: number;
    height?: number;

    // optional style to apply to the control
    style?: object;

    // Label and name props.
    name: string;
    label: string;

    // Style props
    className: string;
    bgColor: string; // fill
    textColor: string;
    fontSize: number;
    valueWithFormat: string;

    // Events props
    onClick?: any;

    // Others
    hasChildren: boolean;

    valueUnit: string;

};
