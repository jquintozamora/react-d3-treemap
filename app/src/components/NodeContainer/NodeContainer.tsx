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
            bgOpacity: "1",
            borderColorHover: "transparent",
        };
    }

    public render() {
        const { hoverAnimation, onClick } = this.props;
        return (
            <Node
                {...this.props}
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
