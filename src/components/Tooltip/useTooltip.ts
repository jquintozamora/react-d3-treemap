import * as React from "react";

import TooltipContext, { ITooltipContext } from "./TooltipContext";

const useTooltip = (): ITooltipContext => {
  return React.useContext(TooltipContext);
};

export default useTooltip;
