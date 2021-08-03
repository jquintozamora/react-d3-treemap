import "./App.css";

import ContainerDimensions from "react-container-dimensions";
import { scaleSequential } from "d3-scale";
import * as chromatic from "d3-scale-chromatic";
import { hot } from "react-hot-loader";

import * as React from "react";
// import { data } from "../data/data";
import { data as generatedData } from "../data/generateData";
import TreeMap, { ColorModel } from "../components/TreeMap";
import { NumberOfChildrenPlacement } from "../components/Node";

interface TreeMapInPutData {
  name: string;
  value?: number;
  children?: Array<TreeMapInPutData>;
  className?: string;
}

class App extends React.Component<unknown, { data: TreeMapInPutData }> {
  private treeMapRef: React.RefObject<TreeMap<TreeMapInPutData>>;

  constructor(props) {
    super(props);
    this.state = {
      data: generatedData,
    };
    this.treeMapRef = React.createRef();
  }

  // componentDidMount() {
  //   console.log(
  //     "componentDidMount: ",
  //     this.treeMapRef && this.treeMapRef.current
  //   );
  // }

  public render() {
    return (
      <React.Fragment>
        <ContainerDimensions>
          {({ width }) => {
            return (
              <TreeMap<TreeMapInPutData>
                ref={this.treeMapRef}
                id="myTreeMap"
                width={width}
                height={400}
                data={this.state.data}
                className="AppTreeMap"
                nodeClassName="AppTreeMap__node"
                valueFn={(value: number) => {
                  return `${value.toString().charAt(0)} min`;
                }}
                // levelsToDisplay={2}
                // tooltipOffsetY={25}
                // tooltipClassName="MyCustomTooltip"
                // tooltipPlacement="top"
                // disableTooltip={true}
                // valueUnit={"MB"}
                // svgClassName="AppTreeMap__svg"
                // paddingInner={2}
                // onZoom={(level, id, items) => console.log({ level, id, items })}
                // onTreeMapDidMount={(treeMap: TreeMap<TreeMapInPutData>) =>
                //   console.log(treeMap.getZoomLevel())
                // }
                nodeStyle={{
                  fontSize: 12,
                  paddingTop: 2,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}
                numberOfChildrenPlacement={NumberOfChildrenPlacement.TopRight}
                customD3ColorScale={scaleSequential(
                  chromatic.interpolateSpectral
                )}
                colorModel={ColorModel.OneEachChildren}
                // svgStyle={{fontFamily: "'Courier New', Courier, monospace"}}
                // nodeStyle={{fill: "black", stroke: "white"}}
                // disableBreadcrumb={true}
                // hideNumberOfChildren={true}
                // hideValue={true}
                darkNodeBorderColor="silver"
                darkNodeTextColor="white"
                lightNodeBorderColor="brown"
                lightNodeTextColor="brown"
                // splitRegExp={/(?=[A-Z][^A-Z])/g}
              />
            );
          }}
        </ContainerDimensions>
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
