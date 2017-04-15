import * as React from "react";

/* tslint:disable:no-var-requires */
const styles: any = require("./Node.module.css");
/* tslint:enable:no-var-requires */


import { INodeProps } from "./INodeProps";

class Node extends React.Component<INodeProps, {}> {

    public render() {
        return this._getNestedFolderTypeNode();
    }

    private _getNestedFolderTypeNode() {
        const {
            bgColor,
            onClick,
            name,
            id,
            label,
            valueWithFormat,
            hasChildren,
            xTranslated,
            yTranslated,
            isSelectedNode,
            width,
            height,
            fontSize,
            textColor,
            nodeTotalNodes,
            globalTotalNodes
        } = this.props;
        const cursor = hasChildren === true && isSelectedNode === false ? "pointer" : "auto";
        return (
            <g
                transform={`translate(${xTranslated},${yTranslated})`}
                // ref={id}
                className={styles.node + " " + (nodeTotalNodes === globalTotalNodes ? styles.rootNode : null)}
                id={id}
                onClick={hasChildren ? onClick : null}
                style={{ cursor }}
            >
                <rect
                    id={"rect-" + name}
                    width={width}
                    height={height}
                    fill={bgColor}
                />
                <clipPath
                    id={"clip-" + name}
                >
                    <use xlinkHref={"#rect-" + name + ""} />
                </clipPath>
                <text
                    clipPath={"url(#clip-" + name + ")"}
                >
                    {this._getLabelNewLine()}
                    <tspan fontSize={fontSize} fill={textColor} x={4} dy={fontSize + 3} >
                        {nodeTotalNodes + "/" + globalTotalNodes}
                    </tspan>
                </text>
                <text
                    clipPath={"url(#clip-" + name + ")"}
                    x={20}
                    y={20}
                >
                    test
                </text>
                <title>{label + "\n" + valueWithFormat}</title>
            </g>
        );
    }

    private _getLabelNewLine() {
        const { label,
            textColor,
            fontSize,
            valueWithFormat,
            hasChildren,
            nodeTotalNodes,
            globalTotalNodes } = this.props;
        if (hasChildren === true) {
            return (
                <tspan fontSize={fontSize} fill={textColor} dx={4} dy={fontSize + 3} >
                    {label + "\xa0" + valueWithFormat + "\xa0" + nodeTotalNodes + "/" + globalTotalNodes}
                </tspan>
            );
        } else {
            if (label) {
                return label.split(/(?=[A-Z][^A-Z])/g).concat(valueWithFormat).map((item, index) => {
                    return (
                        <tspan fontSize={fontSize} fill={textColor} key={index} x={4} dy={fontSize + 3} >
                            {item}
                        </tspan>
                    );
                });
            }

        }
    }

}
export default Node;
