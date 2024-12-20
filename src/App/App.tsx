import "./App.css"

import { scaleSequential } from "d3-scale"
import * as chromatic from "d3-scale-chromatic"

import * as React from "react"
import { data as generatedData } from "../data/data"
// import { data as generatedData } from "../data/generateData"
import TreeMap, { ColorModel } from "../components/TreeMap"
import { NumberOfChildrenPlacement } from "../components/Node"
import { useMeasure } from "@react-hookz/web"

export interface TreeMapInPutData {
  id: number
  name: string
  value?: number
  children?: Array<TreeMapInPutData>
  className?: string
  link?: string
}

const App: React.FunctionComponent<{ data?: TreeMapInPutData }> = ({
  data,
}) => {
  const [measurements, measureRef] = useMeasure<HTMLDivElement>()
  const { width } = measurements || {}
  const innerData = data ? data : generatedData

  return (
    <>
      <div ref={measureRef}>
        {width > 0 ? (
          <TreeMap<TreeMapInPutData>
            id="myTreeMap"
            width={width}
            height={400}
            data={innerData}
            className="AppTreeMap"
            nodeClassName="AppTreeMap__node"
            valueFn={(value: number) => {
              return `${value.toString()} pages`
            }}
            // levelsToDisplay={3}
            onNodeClick={(node) => console.log("clicked", node)}
            // disableBreadcrumb={true}
            // tooltipOffsetY={25}
            // tooltipClassName="MyCustomTooltip"
            // tooltipPlacement="top"
            // disableTooltip={true}
            // valueUnit={"MB"}
            // svgClassName="AppTreeMap__svg"
            paddingInner={1}
            paddingOuter={1}
            // onZoom={(level, id, items) => console.log({ level, id, items })}
            // nodeStyle={{
            //   fontSize: 12,
            //   paddingTop: 2,
            //   paddingLeft: 5,
            //   paddingRight: 5,
            // }}
            // nodeStyle={{fill: "black", stroke: "white"}}
            numberOfChildrenPlacement={NumberOfChildrenPlacement.None}
            customD3ColorScale={scaleSequential(chromatic.interpolateGreens)}
            // customD3ColorScale={scaleSequential(chromatic.interpolatePuBuGn)}
            colorModel={ColorModel.Value}
            // svgStyle={{fontFamily: "'Courier New', Courier, monospace"}}
            // hideValue={true}
            darkNodeBorderColor="white"
            lightNodeBorderColor="black"
            darkNodeTextColor="white"
            lightNodeTextColor="black"
            // splitRegExp={/(?=[A-Z][^A-Z])/g}
          />
        ) : null}
      </div>
    </>
  )
}

export default App
