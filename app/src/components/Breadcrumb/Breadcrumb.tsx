import * as React from "react";

import { IBreadcrumbProps, IBreadcrumbItem } from "./IBreadcrumbProps";

/* tslint:disable:no-var-requires */
const styles: any = require("./Breadcrumb.module.css");
/* tslint:enable:no-var-requires */

export class Breadcrumb extends React.Component<IBreadcrumbProps, {}> {

    public render() {
        return (
            <div className={styles.breadcrumb}>
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
                return <a id={item.key} key={item.key} onClick={this._onBreadcrumbClicked.bind(this, item)} href={item.href}>{item.text}</a>
            });
        }
    }

    private _onBreadcrumbClicked(item: IBreadcrumbItem, ev: React.MouseEvent<HTMLElement>) {
        if (item.onClick) {
            item.onClick(ev, item);
        }
    }
}

export { IBreadcrumbItem } from "./IBreadcrumbProps";


