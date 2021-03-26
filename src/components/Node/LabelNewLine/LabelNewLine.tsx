import * as React from "react";
import { getTextDimensions, truncateText } from "../helpers";

interface LabelNewLineProps {
  label: string;
  textColor: string;
  value: string;
  hasChildren: boolean;
  containerWidth: number;
  containerHeight: number;
  style: React.CSSProperties;
}

const LabelNewLine: React.FunctionComponent<LabelNewLineProps> = ({
  label,
  textColor,
  value,
  hasChildren,
  containerWidth,
  containerHeight,
  style,
}) => {
  if (!label) {
    return null;
  }

  const fullLabel = value ? `${label}\xa0${value}` : label;
  const { width, height } = getTextDimensions(fullLabel, style);
  if (containerHeight < height) {
    return null;
  }
  const maxTextRows = Math.floor(containerHeight / height);
  const splitLabel =
    width >= containerWidth || !hasChildren
      ? label
          .split(/(?=[A-Z/a-z0-9.][^A-Z/a-z0-9. ])/g)
          .concat(value)
          .slice(0, maxTextRows)
      : [fullLabel];

  return (
    <>
      {splitLabel.map((item: string, index) => {
        return (
          <tspan
            fontSize={style.fontSize}
            fill={textColor}
            key={index}
            x={0}
            dy={style.fontSize}
          >
            {truncateText(item, style, containerWidth)}
          </tspan>
        );
      })}
    </>
  );
};

export default LabelNewLine;
