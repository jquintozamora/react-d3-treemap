import * as React from "react";

export interface ITooltipContext {
  showTooltip: (content: React.ReactNode, event: React.MouseEvent) => void;
  hideTooltip: () => void;
  tooltipClassName?: string;
  disableTooltip: boolean;
}

const defaultValues: ITooltipContext = {
  showTooltip: () => {
    throw new Error("TooltipContext not initalized");
  },
  hideTooltip: () => {
    throw new Error("TooltipContext not initalized");
  },
  disableTooltip: false,
};

const TooltipContext = React.createContext<ITooltipContext>(defaultValues);

export default TooltipContext;
