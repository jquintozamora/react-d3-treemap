import "./App.css";

import ContainerDimensions from "react-container-dimensions";
import { scaleSequential } from "d3-scale";
import * as chromatic from "d3-scale-chromatic";
import { hot } from "react-hot-loader";

import * as React from "react";
import { data as data1 } from "../data/data";
import { data as data2 } from "../data/data.1.level";
import TreeMap, { ColorModel } from "../components/TreeMap";

interface TreeMapInPutData {
  name: string;
  value?: number;
  children?: Array<TreeMapInPutData>;
  className?: string;
}

class App extends React.Component<{}, { data: TreeMapInPutData }> {
  private treeMapRef: React.RefObject<TreeMap<TreeMapInPutData>>;

  constructor(props) {
    super(props);
    this.state = {
      data: data1
    };
    this.treeMapRef = React.createRef();
  }

  public render() {
    return (
      <React.Fragment>
        <ContainerDimensions>
          {({ width, height }) => (
            <TreeMap<TreeMapInPutData>
              ref={this.treeMapRef}
              id="myTreeMap"
              width={width}
              height={400}
              data={this.state.data}
              valueUnit={"MB"}
              className="AppTreeMap"
              nodeClassName="AppTreeMap__node"
              svgClassName="AppTreeMap__svg"
              paddingInner={2}
              onZoom={(level, id, items) => console.log({ level, id, items })}
              nodeStyle={{ fontSize: 12, paddingTop: 2, paddingLeft: 2 }}
              // customD3ColorScale={scaleSequential(
              //   chromatic.interpolateViridis
              // )}
              // svgStyle={{fontFamily: "'Courier New', Courier, monospace"}}
              // nodeStyle={{fill: "black", stroke: "white"}}
              // disableBreadcrumb={true}
              // hideNumberOfChildren={true}
              // hideValue={true}
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
        <div>
          <a
            onClick={() => console.log(this.treeMapRef.current.getZoomLevel())}
          >
            Zoom level
          </a>
        </div>
      </React.Fragment>
    );
  }
}

export default hot(module)(App);