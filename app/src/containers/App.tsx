import * as React from "react";
import TreeMap from "../components/TreeMap/TreeMap";
import { data } from "../data/data";
import ContainerDimensions from 'react-container-dimensions';

export default class App extends React.Component<{}, {}> {
    public render() {
        return (
            <ContainerDimensions>
                {({ width, height }) =>
                    <TreeMap
                        width={width}
                        height={400}
                        data={data}
                        valueUnit={"MB"}
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
