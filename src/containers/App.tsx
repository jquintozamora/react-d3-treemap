import "./App.css";

import * as React from "react";
import TreeMap from "../components/TreeMap/TreeMap";
import { data as data1 } from "../data/data";
import { data as data2 } from "../data/data.1.level";
import ContainerDimensions from "react-container-dimensions";
import { ColorModel } from "../components/TreeMap/ITreeMapProps";

import { hot } from "react-hot-loader";

interface TreeMapInPutData {
  name: string;
  value?: number;
  children?: Array<TreeMapInPutData>;
  className?: string;
}

class App extends React.Component<{}, { data: any }> {
  private treeMapRef: React.RefObject<TreeMap<TreeMapInPutData>>;

  constructor(props) {
    super(props);
    this.state = {
      data: data1
    };
    this.treeMapRef = React.createRef();
  }

  onResetZoomClick = () => {};

  public render() {
    return (
      <React.Fragment>
        <ContainerDimensions>
          {({ width, height }) => (
            <TreeMap
              ref={this.treeMapRef}
              id="myTreeMap"
              width={width}
              height={400}
              data={this.state.data}
              valueUnit={"MB"}
              colorModel={ColorModel.Depth}
              animated={false}
              className="AppTreeMap"
              style={{ backgroundColor: "red" }}
              // disableBreadcrumb
              // hideNumberOfChildren
              // hideValue
              // bgColorRangeLow={"#007AFF"}
              // bgColorRangeHigh={"#FFF500"}
              // bgColorRangeLow={"#FFFFBF"}
              // bgColorRangeHigh={"#91CF60"}
            />
          )}
        </ContainerDimensions>
        <div>
          <a onClick={() => this.setState({ data: data2 })}>Change data</a>
        </div>
        <div>
          <a onClick={() => this.treeMapRef.current.resetZoom()}>Zoom Reset</a>
        </div>
        <div>
          <a onClick={() => this.treeMapRef.current.zoomOut()}>Zoom out</a>
        </div>
      </React.Fragment>
    );
  }
}

export default hot(module)(App);
