import * as React from "react";
import { Utils } from "../../utils/Utils";
import Node from "../Node/Node";

import { INodeContainerProps } from "./INodeContainerProps";
import { INodeContainerState } from "./INodeContainerState";

class NodeContainer extends React.Component<INodeContainerProps, INodeContainerState> {

    constructor(props: any, context: any) {
        super(props, context);
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
            isSelectedNode,
            nodeTotalNodes,
            url,
            treemapId
        } = this.props;
        const xTranslated = zoomEnabled === true ? xScaleFunction(x0) : x0;
        const yTranslated = zoomEnabled === true ? yScaleFunction(y0) : y0;
        const width = xScaleFactor * (x1 - x0);
        const height = yScaleFactor * (y1 - y0);
        return (
            <Node
                {...this.props}
                xTranslated={xTranslated}
                yTranslated={yTranslated}
                height={height}
                width={width}
                url={url}
                treemapId={treemapId}
            />
        );
    }
}

export default NodeContainer;
