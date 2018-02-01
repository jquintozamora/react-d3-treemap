/// <reference types="react" />
import * as React from "react";
import { INodeContainerProps } from "./INodeContainerProps";
import { INodeContainerState } from "./INodeContainerState";
declare class NodeContainer extends React.Component<INodeContainerProps, INodeContainerState> {
    constructor(props: any, context: any);
    render(): JSX.Element;
    private _getNestedFolderTypeNode();
}
export default NodeContainer;
