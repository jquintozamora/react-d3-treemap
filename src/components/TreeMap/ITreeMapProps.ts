import { ScaleSequential } from "d3-scale";

export interface ITreeMapProps<TreeMapInputData> {
  id: string;
  width: number;
  height: number;
  data: TreeMapInputData;
  /*
        Unit for values. For example MB
    */
  valueUnit?: string;

  /*
   * Format for the values
   * https://github.com/d3/d3-format#format
   */
  valueFormat?: string;

  /*
   * Create and interpolates a background color range
   */
  bgColorRangeLow?: string;
  bgColorRangeHigh?: string;

  /*
   * We do not need colorText anymore as it will be calculated as a high contrast color depending on background
   */
  // colorText?: string;

  /**
   * Hide breadcrumb
   */
  disableBreadcrumb?: boolean;

  colorModel?: ColorModel;

  hideNumberOfChildren?: boolean;
  hideValue?: boolean;
  animated?: boolean;

  className?: string;
  svgClassName?: string;
  nodeClassName?: string;
  svgStyle?: React.CSSProperties;
  nodeStyle?: React.CSSProperties;
  paddingInner?: number;

  customD3ColorScale?: ScaleSequential<string>;

  namePropInData?: string;
  linkPropInData?: string;
  valuePropInData?: string;
  childrenPropInData?: string;
}

export enum ColorModel {
  Depth,
  Value,
  NumberOfChildren,
  OneEachChildren
}
