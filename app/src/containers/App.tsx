import * as React from "react";
import TreeMap from "../components/TreeMap/TreeMap";
import { data } from "../data/data";

export default class App extends React.Component<{}, {}> {
    public render() {
        return (
            <TreeMap
                height={300}
                width={600}
                data={data}
                // bgColorRangeLow={"#007AFF"}
                // bgColorRangeHigh={"#FFF500"}
                // bgColorRangeLow={"#91CF60"}
                // bgColorRangeHigh={"#FFFFBF"}
            />
        );
    }
}
