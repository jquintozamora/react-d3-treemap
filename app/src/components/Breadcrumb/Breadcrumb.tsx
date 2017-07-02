import * as React from "react";
import { Utils } from "../../utils/Utils";

import * as styled from "styled-components";

import { IBreadcrumbProps, IBreadcrumbItem } from "./IBreadcrumbProps";

class Breadcrumb extends React.Component<IBreadcrumbProps, {}> {

    public render() {
        return (
            <div className={this.props.className}>
                {this._renderItems()}
            </div>
        );
    }

    private _renderItems() {
        const { items } = this.props;
        if (items
            && items.hasOwnProperty("length")
            && items.length > 0) {
            return items.map((item: IBreadcrumbItem) => {
                return (
                    <a
                        id={item.key}
                        key={item.key}
                        onClick={this._onBreadcrumbClicked.bind(this, item)}
                        href={item.href}
                    >
                        {item.text}
                    </a>
                );
            });
        }
    }

    private _onBreadcrumbClicked(item: IBreadcrumbItem, ev: React.MouseEvent<HTMLElement>) {
        if (item.onClick) {
            item.onClick(ev, item);
        }
    }
}

export const BreadcrumbStyled: any = styled.default(Breadcrumb) `
    text-align: center;
    display: block;
    overflow: hidden;
    margin-top: 5px;
    margin-bottom: 5px;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif;

    > a {
        text-decoration: none;
        outline: none;
        display: block;
        float: left;
        font-size: 12px;
        line-height: 36px;
        color: black;
        padding: 0 10px 0 30px;
        position: relative;
        cursor: pointer;
        background-color: #ffffff;
        background-color: ${props => props.bgColor};
    }

    a:first-child {
        padding-left: 16px;
    }

    a::after {
        content: '';
        position: absolute;
        top: 0;
        right: -18px;
        width: 36px;
        height: 36px;
        transform: scale(.707) rotate(45deg);
        z-index: 1;
        box-shadow: 2px -2px 0 2px rgb(206, 230, 140);
        box-shadow: 1px -1px 0 0px ${props => props.currentBgColor};
        border-radius: 0 5px 0 50px;
        background-color: #ffffff;
        background-color: ${props => props.bgColor};
        color: rgb(206, 230, 140);
        color: ${props => Utils.getHighContrastColorFromString(props.bgColor)};
    }

    a:hover, a:hover::after {
        background-color: rgb(206, 230, 140);
        background-color: ${props => props.hoverBgColor};
        color: #ffffff;
        color: ${props => Utils.getHighContrastColorFromString(props.hoverBgColor)};
    }

    a:last-child {
        padding-right: 20px;
        background-color: rgb(206, 230, 140);
        background-color: ${props => props.currentBgColor};
        color: #ffffff;
        color: ${props => Utils.getHighContrastColorFromString(props.currentBgColor)};
        cursor: auto;
    }
    a:last-child::after {
        background-color: rgb(206, 230, 140);
        background-color: ${props => props.currentBgColor};
        color: #ffffff;
        color: ${props => Utils.getHighContrastColorFromString(props.currentBgColor)};
    }
`;

export { IBreadcrumbItem } from "./IBreadcrumbProps";
