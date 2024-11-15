export type NodeId = number

export interface BaseTreeMapInPutData {
  id: NodeId
  name: string
  value?: number
  children?: Array<BaseTreeMapInPutData>
  className?: string
  link?: string
}

export interface NodeColors {
  bgColor: string
  textColor: string
  borderColor: string
  textColorBorderColorBg: string
}
export type NodeColorsLookup = Record<NodeId, NodeColors>
