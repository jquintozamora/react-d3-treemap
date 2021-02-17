import * as React from "react";
import { Motion, spring } from "react-motion";
import Node, { NodeProps } from "../Node";

type AnimatedNodeProps = NodeProps;

const AnimatedNode: React.FunctionComponent<AnimatedNodeProps> = ({
  x0,
  x1,
  y0,
  y1,
  xScaleFactor,
  yScaleFactor,
  xScaleFunction,
  yScaleFunction,
  zoomEnabled,
  ...rest
}) => {
  // console.log("motion. Render");
  const xTranslated = zoomEnabled === true ? xScaleFunction(x0) : x0;
  const yTranslated = zoomEnabled === true ? yScaleFunction(y0) : y0;
  const width = xScaleFactor * (x1 - x0);
  const height = yScaleFactor * (y1 - y0);
  return (
    <Motion
      defaultStyle={{
        xTranslated: x0,
        yTranslated: y0,
        width: x1 - x0,
        height: y1 - y0
      }}
      style={{
        xTranslated: spring(xTranslated),
        yTranslated: spring(yTranslated),
        width: spring(width),
        height: spring(height)
      }}
    >
      {value => (
        <Node
          xTranslated={value.xTranslated || xTranslated}
          yTranslated={value.yTranslated || yTranslated}
          height={value.height || height}
          width={value.width || width}
          {...rest}
        />
      )}
    </Motion>
  );
};

export default AnimatedNode;
