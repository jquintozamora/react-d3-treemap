import * as React from "react";

import TooltipContext, { TooltipContextValue } from "./TooltipContext";

const useTooltip = (): TooltipContextValue => {
  return React.useContext(TooltipContext);
};

export default useTooltip;
