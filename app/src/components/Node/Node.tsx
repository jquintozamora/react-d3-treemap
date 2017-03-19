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
            backgroundColor,
            onMouseOut,
            onMouseOver,
            id,
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
            >
                <rect
                    id={"rect-" + id}
                    width={x1 - x0}
                    height={y1 - y0}
                    fill={backgroundColor}
                />
                <clipPath
                    id={"clip-" + id}
                >
                    <use xlinkHref={"#rect-" + id + ""} />
                </clipPath>
                <text
                    clipPath={"url(#clip-" + id + ")"}
                >
                    {
                        hasChildren === true ?
                            <tspan x={x0} y={y0}>
                                {id.substring(id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).concat("\xa0" + value)}
                            </tspan> :
                            <tspan x={x0} y={y0}>
                                {id.substring(id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).concat(value)}
                            </tspan>
                    }
                </text>
                <title>{name + "\n" + value}</title>
            </g>
        );
    }
}
export default Node;
