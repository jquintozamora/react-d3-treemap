import * as React from "react";
import { useMeasure } from "react-use";
import { TooltipPlacement, TooltipPosition } from "./types";

interface TooltipContainerProps {
  position: TooltipPosition;
  placement: TooltipPlacement;
  children?: React.ReactNode;
}

export const TooltipContainer = React.memo<TooltipContainerProps>(
  ({ position, placement, children }) => {
    const [measureRef, { width, height }] = useMeasure();

    const [newX, newY] = position;
    let x = Math.round(newX);
    let y = Math.round(newY);

    const offset = 10;

    if (width > 0 && height > 0) {
      switch (placement) {
        case "bottom":
          x -= width / 2;
          y += offset;
          break;
        case "bottomLeft":
          x -= width + offset;
          y += height / 2 + offset;
          break;
        case "bottomRight":
          x += offset;
          y += height / 2 + offset;
          break;
        case "left":
          x -= width + offset;
          y -= height / 2;
          break;
        case "right":
          x += offset;
          y -= height / 2;
          break;
        case "top":
          x -= width / 2;
          y -= height + offset;
          break;
        case "topLeft":
          x -= width + offset;
          y -= height + offset;
          break;
        case "topRight":
          x += offset;
          y -= height + offset;
          break;
        default:
          break;
      }
    }

    const style: React.CSSProperties = {
      pointerEvents: "none",
      position: "absolute",
      zIndex: 10,
      top: 0,
      left: 0,
      maxWidth: "calc(50% - 15px)",
      transform: `translate(${x}px, ${y}px)`,
    };

    return (
      <div ref={measureRef} style={style}>
        {children}
      </div>
    );
  }
);

export default TooltipContainer;
