import * as React from "react";

import { ID3HierarchyProps } from "./ID3HierarchyProps";
import { ID3HierarchyState } from "./ID3HierarchyState";

import * as d3 from "d3-hierarchy";

import { data } from "../../data/data";

/* tslint:disable:no-var-requires */
const styles: any = require("./D3Hierarchy.module.css");
/* tslint:enable:no-var-requires */

class D3Hierarchy extends React.Component<ID3HierarchyProps, ID3HierarchyState> {

    // Default Props values
    public static defaultProps: ID3HierarchyProps = {
        id: ""
    };

    constructor(props: any, context: any) {
        super(props, context);

        // Default State values
        this.state = {
            disabled: false,
            errors: [],
            options: [],
            value: null
        };
    }

    // Initial Async Loading here. Only in Container Components
    public componentDidMount() {
    }


    public render() {
        console.log("D3 render");
        const props = this.props;


        const width = 960,
            height = 1060;

        // 1. Create treemap structure
        const treemap = d3.treemap()
            .size([width, height])
            .padding(2)
            .round(true);

        // 2. Before compute a hierarchical layout, we need a root node
        //      If the data is in JSON we use d3.hierarchy
        //      If the data is in flat CSV we can use d3.stratify
        // const root = d3.hierarchy(data, (d: any) => { return d && d.map((item: any) => {return { item: item, my: "hi"}; });});
        const root = d3.hierarchy(data);
        // var root = d3.hierarchy({ values: nest.entries(data) }, function (d) { return d.values; })
        //     .sum(function (d) { return d.value; })
        //     .sort(function (a, b) { return b.value - a.value; });


        var nodes = treemap(root
            .sum(function (d: any) { return d.value; })
            .sort(function (a, b) { return b.height - a.height || b.value - a.value; }))
            .descendants();

        var cells = nodes.map((node, idx) => {
            return (
                <div>
                    {node}
                </div>
            );
        }, this);


        var t = d3.treemap()
            // make sure calculation loop through all objects inside array
            // .children((d) => d)
            .size([10, 10]);
        //          .sticky(true)
        //        .value((d) => { return d.value; });

        // var tile = d3Hierarchy.treemapBinary;
        // tile(data, 0, 0, 6, 4);

        var tree = t(root);

        return (
            <g className='treemap'>
                {t}
            </g>
        );
    }

}

export default D3Hierarchy;
