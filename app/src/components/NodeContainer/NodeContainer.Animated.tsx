import * as React from "react";
import { Motion, spring } from 'react-motion';
import { Utils } from "../../utils/Utils";
import Node from "../Node/Node";

import { INodeContainerProps } from "./INodeContainerProps";
import { INodeContainerState } from "./INodeContainerState";

class NodeContainer extends React.Component<INodeContainerProps, INodeContainerState> {

    constructor(props: any, context: any) {
        super(props, context);

        // Default State values
        this.state = {};
    }

    public render() {
        return this._getNestedFolderTypeNode();
    }

    private _getNestedFolderTypeNode() {
        const {
            x0,
            x1,
            y0,
            y1,
            xScaleFactor,
            yScaleFactor,
            xScaleFunction,
            yScaleFunction,
            zoomEnabled
        } = this.props;
        // console.log("motion. Render");
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


}
export default NodeContainer;
