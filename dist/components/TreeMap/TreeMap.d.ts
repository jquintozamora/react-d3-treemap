/// <reference types="react" />
import * as React from "react";
import { ITreeMapProps } from "./ITreeMapProps";
import { ITreeMapState } from "./ITreeMapState";
declare class TreeMap extends React.Component<ITreeMapProps, ITreeMapState> {
    static defaultProps: ITreeMapProps;
    private _treemap;
    private _rootData;
    private _nodes;
    private _valueFormatFunction;
    private _nodesbgColorFunction;
    constructor(props: ITreeMapProps, context: any);
    componentWillReceiveProps(nextProps: ITreeMapProps): void;
    render(): JSX.Element;
    private _createD3TreeMap(width, height);
    private _getNode(node);
    private _onBreadcrumbItemClicked;
    private _onNodeClick;
    private _zoomTo(nodeId);
}
export default TreeMap;
