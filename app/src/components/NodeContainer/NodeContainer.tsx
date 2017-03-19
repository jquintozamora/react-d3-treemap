import * as React from "react";
import { Utils } from "../../utils/Utils";

import Node from "../Node/Node";

import { INodeContainerProps } from "./INodeContainerProps";
import { INodeContainerState } from "./INodeContainerState";

class NodeContainer extends React.Component<INodeContainerProps, INodeContainerState> {

    constructor(props: any, context: any) {
        super(props, context);

        // Default State values
        this.state = {
            fill: this.props.fill
        };
    }

    public render() {
        console.log("Render. NodeContainer");
        const { hoverAnimation } = this.props;

        return (
            <Node
                {...this.props}
                fill={this.state.fill}
                handleMouseOver={hoverAnimation ? this._animateCell : null}
                handleMouseLeave={hoverAnimation ? this._restoreCell : null}
            />
        );
    }


    private _animateCell = () => {
        this.setState({
            fill: Utils.shade(this.props.fill, 0.05)
        });
    }

    private _restoreCell = () => {
        this.setState({
            fill: this.props.fill
        });
    }
}
export default NodeContainer;
