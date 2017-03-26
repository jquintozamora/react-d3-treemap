import * as React from "react";
import { findDOMNode } from 'react-dom';
import { Utils } from "../../utils/Utils";

import { select } from "d3-selection";
import { transition } from "d3-transition";

import Node from "../Node/Node";

import { INodeContainerProps } from "./INodeContainerProps";
import { INodeContainerState } from "./INodeContainerState";

class NodeContainer extends React.Component<INodeContainerProps, INodeContainerState> {


    constructor(props: any, context: any) {
        super(props, context);

        // Default State values
        this.state = {
            bgOpacity: "1",
            borderColorHover: "transparent",
        };
    }

    public componentDidUpdate() { this._doTranslateAnimated(); }
    public componentDidMount() { this._doTranslateAnimated(); }

    private _doTranslateAnimated = () => {
        if (this.props.zoomEnabled === true) {
            let node = findDOMNode(this.refs[this.props.id]);
            // debugger;
            //.select(node).call(this.axis);
            select(node)
                .transition()
                .duration(1750)
                .attr("transform", (d: any) => {
                    return "translate(" + this.props.xScaleFunction(d.x) + "," + this.props.yScaleFunction(d.y) + ")";
                });
        }
    }

    /*public render() {
        const { hoverAnimation, onClick } = this.props;
        return (
            <Node
                {...this.props}
                ref={this.props.id}
                bgOpacity={this.state.bgOpacity}
                borderColorHover={this.state.borderColorHover}
                onMouseOver={hoverAnimation ? this._animateCell : null}
                onMouseOut={hoverAnimation ? this._restoreCell : null}
                onClick={onClick}
            />
        );
    }*/
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
            name,
            id,
            label,
            textColor,
            valueWithFormat,
            className,
            fontSize,
            hasChildren,
            xScaleFactor,
            yScaleFactor,
            xScaleFunction,
            yScaleFunction,
            zoomEnabled,
            onClick
        } = this.props;
        const bgOpacity = this.state.bgOpacity;
        const borderColorHover = this.state.borderColorHover;
        const onMouseOver = this.props.hoverAnimation ? this._animateCell : null;
        const onMouseOut = this.props.hoverAnimation ? this._restoreCell : null;
        const translate = zoomEnabled === true
            ?
            `translate(${xScaleFunction(x0)},${yScaleFunction(y0)})`
            : `translate(${x0},${y0})`;
        return (
            <g
                transform={translate}
                ref={id}
                className="node"
                id={id}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={onClick}
            >
                <rect
                    id={"rect-" + name}
                    width={xScaleFactor * (x1 - x0)}
                    height={yScaleFactor * (y1 - y0)}
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
                    {this._getLabelNewLine(label, valueWithFormat, hasChildren)}
                </text>
                <title>{label + "\n" + valueWithFormat}</title>
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

    private _animateCell = () => {
        this.setState({
            bgOpacity: "0.8",
            borderColorHover: this.props.borderColorHover
        });
    }

    private _restoreCell = () => {
        this.setState({
            bgOpacity: "1",
            borderColorHover: ""
        });
    }
}
export default NodeContainer;
