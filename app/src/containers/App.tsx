import * as React from "react";
import TreeMap from "../components/TreeMap/TreeMap";
import { data } from "../data/data";

export default class App extends React.Component<{}, {}> {
    public render() {
        return (
            <TreeMap
                height={500}
                width={800}
                data={data}
                valueUnit={"MB"}
                // bgColorRangeLow={"#007AFF"}
                // bgColorRangeHigh={"#FFF500"}
                // bgColorRangeLow={"#FFFFBF"}
                // bgColorRangeHigh={"#91CF60"}
            />
        );
    }
}
