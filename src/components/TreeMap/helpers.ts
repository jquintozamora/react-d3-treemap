import { BaseTreeMapInPutData, CustomHierarchyRectangularNode } from "./TreeMap"
import { rgb } from "d3-color"
import { ScaleSequential, scaleLinear } from "d3-scale"
import { ColorModel } from "./TreeMapProps"
import { extent } from "d3-array"
import { format } from "d3-format"
import { interpolateHcl } from "d3-interpolate"

export const getTopSubParentId = <TreeMapInputData>(
  node: CustomHierarchyRectangularNode<TreeMapInputData>
): number => {
  if (node.parent && node.parent.parent) {
    return getTopSubParentId(node.parent)
  }
  return node.customId
}

export const getTopParent = <TreeMapInputData>(
  node: CustomHierarchyRectangularNode<TreeMapInputData>
): CustomHierarchyRectangularNode<TreeMapInputData> => {
  if (node.parent) {
    return getTopParent(node.parent)
  }
  return node
}

export const getDepth = <TreeMapInputData>(
  obj: TreeMapInputData,
  childrenPropInData: string
): number => {
  let depth = 0
  if (obj[childrenPropInData]) {
    obj[childrenPropInData].forEach((d) => {
      const tmpDepth = getDepth(d, childrenPropInData)
      if (tmpDepth > depth) {
        depth = tmpDepth
      }
    })
  }
  return 1 + depth
}

export const getHighContrastColor = (
  r: number,
  g: number,
  b: number
): "dark" | "light" => {
  // based on
  // http://stackoverflow.com/questions/407793/programmatically-choose-high-contrast-colors
  // http://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
  const c = [r / 255, g / 255, b / 255]
  for (let i = 0; i < c.length; ++i) {
    if (c[i] <= 0.03928) {
      c[i] = c[i] / 12.92
    } else {
      c[i] = Math.pow((c[i] + 0.055) / 1.055, 2.4)
    }
  }
  const luminance = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
  // return luminance > 0.179 ? "black" : "white";
  return luminance > 0.4 ? "light" : "dark"
}

export const getHighContrastColorFromString = (
  backgroundColor: string | undefined
): "dark" | "light" => {
  if (!backgroundColor) {
    return "dark"
  }
  const rgbColor = rgb(backgroundColor)
  if (rgbColor) {
    return getHighContrastColor(rgbColor.r, rgbColor.g, rgbColor.b)
  }
}

export const getValueFormatFn = (
  valueFn: (value: number) => string,
  valueFormat: string
): ((value: number) => string) => {
  let valueFormatFn = (value: number) => `${value}`
  try {
    valueFormatFn = valueFn ? valueFn : format(valueFormat)
  } catch (e) {
    console.warn(e)
  }
  return valueFormatFn
}

export const getColorDomainFn = <TreeMapInputData>(
  topNode: CustomHierarchyRectangularNode<TreeMapInputData>,
  data: TreeMapInputData,
  colorModel: ColorModel,
  childrenPropInData: string,
  valuePropInData: string,
  customD3ColorScale: ScaleSequential<string>
): ScaleSequential<string> => {
  const nodes = topNode.descendants() as Array<
    CustomHierarchyRectangularNode<TreeMapInputData>
  >

  let d: [number | { valueOf(): number }, number | { valueOf(): number }]
  switch (colorModel) {
    case ColorModel.Depth:
      d = [0, getDepth<TreeMapInputData>(data, childrenPropInData) - 1]
      break
    case ColorModel.Value:
      d = extent(nodes, (n) => {
        if (n.parent !== null) {
          return n[valuePropInData]
        }
      })
      break
    case ColorModel.NumberOfChildren:
      d = extent(nodes, (n) => (n.parent !== null ? n.descendants().length : 1))
      break
    case ColorModel.OneEachChildren:
      d = [data[childrenPropInData] ? data[childrenPropInData].length : 0, 0]
      break
    default:
      break
  }

  return customD3ColorScale.domain(d)
}

export const getColorsFromNode = <
  TreeMapInputData extends BaseTreeMapInPutData
>({
  node,
  nodeTotalNodes,
  data,
  colorModel,
  childrenPropInData,
  valuePropInData,
  customD3ColorScale,
  defaultColors,
}: {
  node: CustomHierarchyRectangularNode<TreeMapInputData>
  nodeTotalNodes: number
  data: TreeMapInputData
  colorModel: ColorModel
  childrenPropInData: string
  valuePropInData: string
  customD3ColorScale: ScaleSequential<string>
  defaultColors: {
    darkNodeTextColor: string
    darkNodeBorderColor: string
    lightNodeTextColor: string
    lightNodeBorderColor: string
  }
}) => {
  const {
    darkNodeTextColor,
    darkNodeBorderColor,
    lightNodeTextColor,
    lightNodeBorderColor,
  } = defaultColors

  const colorDomainFn = getColorDomainFn(
    getTopParent(node),
    data,
    colorModel,
    childrenPropInData,
    valuePropInData,
    customD3ColorScale
  )

  let backgroundColor
  switch (colorModel) {
    case ColorModel.Depth:
      backgroundColor = colorDomainFn(node.depth)
      if (node.parent === null) {
        backgroundColor = colorDomainFn(0)
      }
      break
    case ColorModel.Value:
      backgroundColor = colorDomainFn(node[valuePropInData])
      if (node.parent === null) {
        backgroundColor = colorDomainFn(1)
      }
      break
    case ColorModel.NumberOfChildren:
      backgroundColor = colorDomainFn(nodeTotalNodes)
      if (node.parent === null) {
        backgroundColor = colorDomainFn(1)
      }
      break
    case ColorModel.OneEachChildren: {
      const originalBackgroundColor = colorDomainFn(
        getTopSubParentId<TreeMapInputData>(node)
      )
      if (node.depth > 1) {
        backgroundColor = scaleLinear<string>()
          .domain([0, node && node.children ? node.children.length : 0])
          .interpolate(interpolateHcl)
          .range(["white", originalBackgroundColor])(
          getTopSubParentId<TreeMapInputData>(node)
        )
      } else {
        backgroundColor = originalBackgroundColor
      }
      if (node.parent === null) {
        backgroundColor = colorDomainFn(0)
      }
    }
  }

  const textColor =
    getHighContrastColorFromString(backgroundColor) === "dark"
      ? darkNodeTextColor
      : lightNodeTextColor
  const borderColor =
    getHighContrastColorFromString(backgroundColor) === "dark"
      ? darkNodeBorderColor
      : lightNodeBorderColor
  const textColorBorderColorBg =
    getHighContrastColorFromString(borderColor) === "dark"
      ? darkNodeTextColor
      : lightNodeTextColor

  return {
    bgColor: backgroundColor,
    textColor,
    borderColor,
    textColorBorderColorBg,
  }
}
