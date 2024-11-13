import "./Tooltip.css"

import * as React from "react"

import useTooltip from "./useTooltip"

interface TooltipProps {
  label: React.ReactNode
  value?: number | string | Date
}

export const Tooltip = ({ label, value }: TooltipProps) => {
  const { tooltipClassName } = useTooltip()
  return (
    <div className={tooltipClassName}>
      <div className="TreeMap__tooltip">
        {value !== undefined ? (
          <>
            <span className="TreeMap__tooltipLabel">{label}: </span>
            <span className="TreeMap__tooltipValue">{`${value}`}</span>
          </>
        ) : (
          label
        )}
      </div>
    </div>
  )
}
