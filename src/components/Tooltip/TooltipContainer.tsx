import * as React from "react";
import { useMeasure } from "react-use";
import { TooltipPlacement, TooltipPosition } from "./types";

interface TooltipContainerProps {
  position: TooltipPosition;
  placement: TooltipPlacement;
  children?: React.ReactNode;
  offsetX?: number;
  offsetY?: number;
}

export const TooltipContainer = React.memo<TooltipContainerProps>(
  ({ position, placement, offsetX = 0, offsetY = 0, children }) => {
    const [measureRef, { width, height }] = useMeasure();

    const [newX, newY] = position;
    let x = Math.round(newX);
    let y = Math.round(newY);

    const marginOffset = 10;

    if (width > 0 && height > 0) {
      switch (placement) {
        case "bottom":
          x -= width / 2;
          y += marginOffset;
          break;
        case "bottomLeft":
          x -= width + marginOffset;
          y += height / 2 + marginOffset;
          break;
        case "bottomRight":
          x += marginOffset;
          y += height / 2 + marginOffset;
          break;
        case "left":
          x -= width + marginOffset;
          y -= height / 2;
          break;
        case "right":
          x += marginOffset;
          y -= height / 2;
          break;
        case "top":
          x -= width / 2;
          y -= height + marginOffset;
          break;
        case "topLeft":
          x -= width + marginOffset;
          y -= height + marginOffset;
          break;
        case "topRight":
          x += marginOffset;
          y -= height + marginOffset;
          break;
        default:
          break;
      }
    }

    x += offsetX;
    y += offsetY;

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
