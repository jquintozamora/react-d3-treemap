import * as React from "react";
import TooltipContainer from "./TooltipContainer";
import TooltipContext from "./TooltipContext";
import { TooltipPlacement, TooltipPosition } from "./types";

const TooltipProvider: React.FunctionComponent<{
  tooltipPlacement?: TooltipPlacement;
  tooltipClassName?: string;
  disableTooltip: boolean;
  tooltipOffsetX?: number;
  tooltipOffsetY?: number;
  children?: React.ReactNode;
}> = ({
  tooltipPlacement,
  tooltipClassName,
  tooltipOffsetX,
  tooltipOffsetY,
  disableTooltip,
  children,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [pos, setPos] = React.useState<TooltipPosition>([null, null]);
  const [content, setContent] = React.useState<React.ReactNode>(null);
  const [placement, setPlacement] = React.useState<TooltipPlacement>(
    tooltipPlacement
  );

  const showTooltip = React.useCallback(
    (content: React.ReactNode, { clientX, clientY }: React.MouseEvent) => {
      const {
        width,
        height,
        left,
        top,
      } = containerRef.current.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;

      if (!placement) {
        const autoPlacement: TooltipPlacement =
          x < width / 2
            ? y < height / 2
              ? "bottomRight"
              : "topRight"
            : y < height / 2
            ? "bottomLeft"
            : "topLeft";
        setPlacement(autoPlacement);
      }

      setIsVisible(true);
      setPos([x, y]);
      setContent(content);
    },
    [containerRef, setContent, setIsVisible, setPos]
  );

  const hideTooltip = React.useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible, setPos]);

  const tooltipContextValue = React.useMemo(
    () => ({
      showTooltip,
      hideTooltip,
      tooltipClassName,
      disableTooltip,
    }),
    [showTooltip, hideTooltip, tooltipClassName]
  );

  return (
    <TooltipContext.Provider value={tooltipContextValue}>
      <div ref={containerRef}>
        {children}
        {isVisible && (
          <TooltipContainer
            position={pos}
            placement={placement}
            offsetX={tooltipOffsetX}
            offsetY={tooltipOffsetY}
          >
            {content}
          </TooltipContainer>
        )}
      </div>
    </TooltipContext.Provider>
  );
};

export default TooltipProvider;
