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
    readonly height: number;
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
    readonly id?: string;

    // Position props
    // x0: number;
    // y0: number;
    // x1: number;
    // y1: number;
    // depth: number;

    // Label and name props.
    name: string;
    label: string;

    // Style props
    className: string;
    bgColor: string; // fill
    bgOpacity: string;
    textColor: string;
    fontSize: string;
    borderColorHover: string;
    valueWithFormat: string;

    // Events props
    onMouseOver?: any;
    onMouseOut?: any;
    onClick?: any;

    // Others
    hasChildren: boolean;

};
