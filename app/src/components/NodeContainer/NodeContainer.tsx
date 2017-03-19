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
            fill: this.props.backgroundColor
        };
    }

    public render() {
        console.log("Render. NodeContainer");
        const { hoverAnimation } = this.props;

        return (
            <Node
                {...this.props}
                backgroundColor={this.state.fill}
                onMouseOver={hoverAnimation ? this._animateCell : null}
                onMouseOut={hoverAnimation ? this._restoreCell : null}
            />
        );
    }


    private _animateCell = () => {
        this.setState({
            fill: Utils.shade(this.props.backgroundColor, 0.05)
        });
    }

    private _restoreCell = () => {
        this.setState({
            fill: this.props.backgroundColor
        });
    }
}
export default NodeContainer;
