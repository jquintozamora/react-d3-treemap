import * as React from "react";

import TooltipContext from "./TooltipContext";

const useTooltip = () => {
  return React.useContext(TooltipContext);
};

export default useTooltip;
