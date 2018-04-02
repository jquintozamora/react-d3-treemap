import * as React from "react";
import TreeMap from "../components/TreeMap/TreeMap";
import { data } from "../data/data";
// import { data } from "../data/data.1.level";
import ContainerDimensions from "react-container-dimensions";
import { ColorModel } from "../components/TreeMap/ITreeMapProps";

export default class App extends React.Component<{}, {}> {
    public render() {
        return (
            <ContainerDimensions>
                {({ width, height }) =>
                    <TreeMap
                        id="myTreeMap"
                        width={width}
                        height={400}
                        data={data}
                        valueUnit={"MB"}
                        colorModel={ColorModel.Depth}
                        // disableBreadcrumb
                        // hideNumberOfChildren
                        // hideValue
                        // bgColorRangeLow={"#007AFF"}
                        // bgColorRangeHigh={"#FFF500"}
                        // bgColorRangeLow={"#FFFFBF"}
                        // bgColorRangeHigh={"#91CF60"}
                    />
                }
            </ContainerDimensions>
        );
    }
}
