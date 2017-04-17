/// <reference types="react" />
import * as React from "react";
import { IBreadcrumbProps } from "./IBreadcrumbProps";
export declare class Breadcrumb extends React.Component<IBreadcrumbProps, {}> {
    render(): JSX.Element;
    private _renderItems();
    private _onBreadcrumbClicked(item, ev);
}
export declare const BreadcrumbStyled: React.ComponentClass<IBreadcrumbProps & {
    theme?: any;
    innerRef?: (instance: any) => void;
}>;
export { IBreadcrumbItem } from "./IBreadcrumbProps";
