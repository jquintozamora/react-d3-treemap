import * as React from "react";

import { INodeProps } from "./INodeProps";

class Node extends React.Component<INodeProps, {}> {

    public render() {
        return this._getNestedFolderTypeNode();
    }

    private _getNestedFolderTypeNode() {
        const {
            x0,
            x1,
            y0,
            y1,
            bgColor,
            bgOpacity,
            borderColorHover,
            onMouseOut,
            onMouseOver,
            onClick,
            name,
            label,
            textColor,
            value,
            className,
            fontSize,
            hasChildren
        } = this.props;
        return (
            <g
                transform={`translate(${x0},${y0})`}
                className="node"
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={onClick}
            >
                <rect
                    id={"rect-" + name}
                    width={x1 - x0}
                    height={y1 - y0}
                    fill={bgColor}
                    fillOpacity={bgOpacity}
                    stroke={borderColorHover}
                />
                <clipPath
                    id={"clip-" + name}
                >
                    <use xlinkHref={"#rect-" + name + ""} />
                </clipPath>
                <text
                    clipPath={"url(#clip-" + name + ")"}
                >
                    {this._getLabelNewLine(label, value, hasChildren)}
                </text>
                <title>{label + "\n" + value}</title>
            </g>
        );
    }

    private _getLabelNewLine(label: string, value: string, hasChildren: boolean) {
        const { textColor } = this.props;
        if (hasChildren === true) {
            return (
                <tspan fill={textColor} x={4} y={13} >
                    {label + "\xa0" + value}
                </tspan>
            );
        } else {
            if (label) {
                return label.split(/(?=[A-Z][^A-Z])/g).concat(value).map((item, index) => {
                    return (
                        <tspan fill={textColor} key={index} x={4} y={13 + index * 10} >
                            {item}
                        </tspan>
                    );
                });
            }

        }

    }
}
export default Node;