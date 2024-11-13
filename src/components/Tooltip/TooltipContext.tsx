import * as React from "react"

export interface TooltipContextValue {
  showTooltip: (content: React.ReactNode, event: React.MouseEvent) => void
  hideTooltip: () => void
  tooltipClassName?: string
  disableTooltip: boolean
}

const defaultValues: TooltipContextValue = {
  showTooltip: () => {
    throw new Error("TooltipContext not initalized")
  },
  hideTooltip: () => {
    throw new Error("TooltipContext not initalized")
  },
  disableTooltip: false,
}

const TooltipContext = React.createContext<TooltipContextValue>(defaultValues)

export default TooltipContext
