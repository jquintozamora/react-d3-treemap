import { CustomHierarchyRectangularNode } from "../components/TreeMap/TreeMap";
import { rgb } from "d3-color";

export class Utils {
  public static getTopSubParent<TreeMapInputData>(
    node: CustomHierarchyRectangularNode<TreeMapInputData>
  ): number {
    if (node.parent && node.parent.parent) {
      return this.getTopSubParent(node.parent);
    }
    return node.customId;
  }

  public static getDepth<TreeMapInputData>(
    obj: TreeMapInputData,
    childrenPropInData: string
  ) {
    let depth = 0;
    if (obj[childrenPropInData]) {
      obj[childrenPropInData].forEach((d) => {
        const tmpDepth = this.getDepth(d, childrenPropInData);
        if (tmpDepth > depth) {
          depth = tmpDepth;
        }
      });
    }
    return 1 + depth;
  }

  public static getHighContrastColor(
    r: number,
    g: number,
    b: number
  ): "dark" | "light" {
    // based on
    // http://stackoverflow.com/questions/407793/programmatically-choose-high-contrast-colors
    // http://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
    const c = [r / 255, g / 255, b / 255];
    for (let i = 0; i < c.length; ++i) {
      if (c[i] <= 0.03928) {
        c[i] = c[i] / 12.92;
      } else {
        c[i] = Math.pow((c[i] + 0.055) / 1.055, 2.4);
      }
    }
    const luminance = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    // return luminance > 0.179 ? "black" : "white";
    return luminance > 0.4 ? "light" : "dark";
  }

  public static getHighContrastColorFromString(
    backgroundColor: string | undefined
  ): "dark" | "light" {
    if (!backgroundColor) {
      return "dark";
    }
    const rgbColor = rgb(backgroundColor);
    if (rgbColor) {
      return Utils.getHighContrastColor(rgbColor.r, rgbColor.g, rgbColor.b);
    }
  }
}
