import * as React from "react";
import TreeMap from "../components/TreeMap/TreeMap";
import { AnimationsTest } from "../components/AnimationsTest";

import { data } from "../data/data";

/*<TreeMap
                height={600}
                width={600}
                data={data}
            />*/
export default class App extends React.Component<{}, {}> {
    public render() {
        return (
           <TreeMap
                height={600}
                width={600}
                data={data}
            />
        );
    }
}
