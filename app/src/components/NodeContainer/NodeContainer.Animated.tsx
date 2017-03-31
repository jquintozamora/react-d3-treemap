import * as React from "react";
import { findDOMNode } from 'react-dom';
import { Motion, spring } from 'react-motion';

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
            translate: "translate(0,0)"
        };
    }

    public shouldComponentUpdate(nextProps: INodeContainerProps, nextState: INodeContainerState) {
        // if (this.props.x0 === nextProps.x0
        //     && this.props.y0 === nextProps.y0
        //     && this.props.xScaleFactor === nextProps.xScaleFactor
        //     && this.props.yScaleFactor === nextProps.yScaleFactor) {
        //     return false;
        // }

        if (nextProps.x0 < 0) {
            return false;
        }
        if (nextProps.y0 < 0) {
            return false;
        }
        // if (nextProps.xScaleFunction(nextProps.x0) > nextProps.globalWidth) {
        //     return false;
        // }
        // if (nextProps.xScaleFunction(nextProps.x0) < 0) {
        //     return false;
        // }
        // if (nextProps.yScaleFunction(nextProps.y0) > nextProps.globalHeight) {
        //     return false;
        // }
        // if (nextProps.yScaleFunction(nextProps.y0) < 0) {
        //     return false;
        // }

        return true;
    }

    public componentDidMount() {
        //console.log("componentDidMount");
    }
    public componentWillUnmount() {
        //console.log("componentDidUnmount");
    }

    //     let node = d3.select(findDOMNode(this));

    //     this.setState({ className: 'exit' });

    //     node.transition(this.transition)
    //         .attr('y', 60)
    //         .style('fill-opacity', 1e-6)
    //         .on('end', () => {
    //             this.setState({ y: 60, fillOpacity: 1e-6 });
    //             callback()
    //         });
    // }

    //     public componentDidUpdate() { this._doTranslateAnimated(); }
    //     public componentDidMount() { this._doTranslateAnimated(); }

    //     private _doTranslateAnimated = () => {
    //         const { zoomEnabled, xScaleFunction, yScaleFunction, x0, y0 } = this.props;
    //         const translate = zoomEnabled === true
    //             ?
    //             `translate(${xScaleFunction(x0)},${yScaleFunction(y0)})`
    //             : `translate(${x0},${y0})`;


    //         let node = findDOMNode(this.refs[this.props.id]);


    //         var t = transition("one")
    //             .duration(750);

    //         const selection = select(node);
    // debugger;
    //         const t1 = selection
    //             .transition(t)
    //             .attr("transform", function (d: any) {
    //                 debugger;
    //                 const translate = zoomEnabled === true
    //                     ?
    //                     `translate(${xScaleFunction(d.x)},${yScaleFunction(d.y)})`
    //                     : `translate(${d.x},${d.y})`;
    //                 return translate;
    //             });
    //     }

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
            onClick,
            isSelectedNode
        } = this.props;
        const bgOpacity = this.state.bgOpacity;
        const borderColorHover = this.state.borderColorHover;
        const onMouseOver = this.props.hoverAnimation ? this._animateCell : null;
        const onMouseOut = this.props.hoverAnimation ? this._restoreCell : null;
        console.log("motion. Render");
        // if (id === "util") {debugger;}
        const xTranslated = zoomEnabled === true ? xScaleFunction(x0) : x0;
        const yTranslated = zoomEnabled === true ? yScaleFunction(y0) : y0;
        const width = xScaleFactor * (x1 - x0);
        const height = yScaleFactor * (y1 - y0);
        return (
            <Motion
                defaultStyle={
                    {
                        xTranslated: x0,
                        yTranslated: y0,
                        width: x1 - x0,
                        height: y1 - y0
                    }
                }
                style={
                    {
                        xTranslated: spring(xTranslated),
                        yTranslated: spring(yTranslated),
                        width: spring(width),
                        height: spring(height)
                    }
                }
            >
                {
                    (value: any) =>
                        (
                            <Node
                                {...this.props}
                                xTranslated={value.xTranslated}
                                yTranslated={value.yTranslated}
                                height={value.height}
                                width={value.width}

                            />
                        )
                }
            </Motion>
        );
    }

    private _getLabelNewLine() {
        const { label, textColor, fontSize, valueWithFormat, hasChildren } = this.props;

        if (hasChildren === true) {
            return (
                <tspan fontSize={fontSize} fill={textColor} dx={4} dy={fontSize + 3} >
                    {label + "\xa0" + valueWithFormat}
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

    private _animateCell = () => {
        // this.setState({
        //     bgOpacity: "0.8",
        //     borderColorHover: this.props.borderColorHover
        // });
    }

    private _restoreCell = () => {
        // this.setState({
        //     bgOpacity: "1",
        //     borderColorHover: ""
        // });
    }
}
export default NodeContainer;
