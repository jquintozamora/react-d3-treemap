/// <reference types="react" />
import * as React from "react";
import { INodeProps } from "./INodeProps";
declare class Node extends React.Component<INodeProps, {}> {
    render(): JSX.Element;
    private _getNestedFolderTypeNode();
    private _getNumberItemsHeightByFontSize(fontSize);
    private _getNumberItemsWidthByNumberOfChars(fontSize, numberOfChars);
    private _getNumberOfItemsRect();
    private _getLabelNewLine();
}
export default Node;
