export interface INodeProps {

    // Position props
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    depth: number;

    // Label and name props
    id: string;
    label: string; // name
    value: string;

    // Style props
    className: string;
    backgroundColor: string; // fill
    textColor: string;
    fontSize: string;

    // Events props
    onMouseOver?: any;
    onMouseOut?: any;

    // Others
    hasChildren: boolean;

};
