import "./App.css";

import { scaleSequential } from "d3-scale";
import * as chromatic from "d3-scale-chromatic";

import * as React from "react";
// import { data } from "../data/data";
import { data as generatedData } from "../data/generateData";
import TreeMap, { ColorModel } from "../components/TreeMap";
import { NumberOfChildrenPlacement } from "../components/Node";
import { useMeasure } from "react-use";

interface TreeMapInPutData {
  name: string;
  value?: number;
  children?: Array<TreeMapInPutData>;
  className?: string;
}

const App: React.FunctionComponent<{ data?: TreeMapInPutData }> = ({ data }) => {
  const treeMapRef: React.RefObject<TreeMap<TreeMapInPutData>> = React.createRef();

  const [measureRef, { width }] = useMeasure();

  const innerData = data ? data : generatedData

  return (
    <React.Fragment>
      <div ref={measureRef}>
        {width > 0 ? <TreeMap<TreeMapInPutData>
          ref={treeMapRef}
          id="myTreeMap"
          width={width}
          height={400}
          data={innerData}
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
        /> : null}
      </div>
      <div>
        <a onClick={() => treeMapRef.current.resetZoom()}>Zoom Reset</a>
      </div>
      <div>
        <a onClick={() => treeMapRef.current.zoomOut()}>Zoom out</a>
      </div>
      <div>
        <a
          onClick={() => console.log(treeMapRef.current.getZoomLevel())}
        >
          Zoom level
        </a>
      </div>
    </React.Fragment>
  );
}

export default App;
