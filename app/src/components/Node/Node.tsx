import * as React from "react";

import { INodeProps } from "./INodeProps";

class Node extends React.Component<INodeProps, {}> {

    public render() {
        const {
            x,
            y,
            width,
            height,
            fill,
            label,
            textColor,
            fontSize,
            handleMouseOver,
            handleMouseLeave } = this.props;

        const textStyle = {
            textAnchor: "middle",
            fill: textColor,
            fontSize
        };
        const transform = `translate(${x},${y})`;
        return (
            <g transform={transform}>
                <rect
                    className="rd3-treemap-cell"
                    width={width}
                    height={height}
                    fill={fill}
                    onMouseOver={handleMouseOver}
                    onMouseLeave={handleMouseLeave}
                />
                <text
                    x={width / 2}
                    y={height / 2}
                    dy=".35em"
                    style={textStyle}
                    className="rd3-treemap-cell-text"
                >
                    {label}
                </text>
            </g>
        );
    }
}
export default Node;
