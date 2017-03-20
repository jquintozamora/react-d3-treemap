export interface INodeProps {

    // Position props
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    depth: number;

    // Label and name props
    id: number;
    name: string;
    label: string;
    value: string;

    // Style props
    className: string;
    backgroundColor: string; // fill
    textColor: string;
    fontSize: string;
    rectStroke: string;

    // Events props
    onMouseOver?: any;
    onMouseOut?: any;
    onClick?: any;

    // Others
    hasChildren: boolean;

};
