import * as React from "react";
import { Utils } from "../../utils/Utils";

import { findDOMNode } from "react-dom";
import { select } from "d3-selection";
import { transition } from "d3-transition";
import { easeCubicInOut } from "d3-ease";

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
            x: this.props.x0,
            y: this.props.y0
        };
    }


    public componentWillReceiveProps(nextProps: INodeContainerProps) {
        console.log("componentWillReceiveProps");
        // if (this.props.x0 != nextProps.x) {
        let node = select(findDOMNode(this));
        const transition1 = transition("one")
            .duration(750)
            .ease(easeCubicInOut);
        node.transition(transition1)
            .attr('x', 1 * 32)
            .on('end', () => this.setState({ x: 1 * 32 }));
        // }
    }

    public componentWillEnter(callback: any) {
        console.log("componentWillEnter");
        let node = select(findDOMNode(this));
        this.setState({ x: 1 * 32 });

        const transition1 = transition("one")
            .duration(750)
            .ease(easeCubicInOut);

        node.transition(transition1)
            .attr('y', 0)
            .style('fill-opacity', 1)
            .on('end', () => {
                this.setState({ y: 0 });
                callback();
            });

    }

    public render() {
         console.log("render");
        const { hoverAnimation, onClick } = this.props;
        return (
            <Node
                {...this.props}
                x0={this.state.x}
                y0={this.state.y}
                bgOpacity={this.state.bgOpacity}
                borderColorHover={this.state.borderColorHover}
                onMouseOver={hoverAnimation ? this._animateCell : null}
                onMouseOut={hoverAnimation ? this._restoreCell : null}
                onClick={onClick}
            />
        );
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
