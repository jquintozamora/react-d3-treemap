export interface INodeProps {

    // Position props
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    depth: number;

    // Label and name props.
    id: number;
    name: string;
    label: string;
    value: string;

    // Style props
    className: string;
    bgColor: string; // fill
    bgOpacity: string;
    textColor: string;
    fontSize: string;
    borderColorHover: string;

    // Events props
    onMouseOver?: any;
    onMouseOut?: any;
    onClick?: any;

    // Others
    hasChildren: boolean;

};
