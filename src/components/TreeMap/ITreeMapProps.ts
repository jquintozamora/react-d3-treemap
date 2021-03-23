import { ScaleSequential } from "d3-scale";
import TreeMap from "../TreeMap";
import { IBreadcrumbItem } from "../Breadcrumb";
import { NumberOfChildrenPlacement } from "../Node";

export interface ITreeMapProps<TreeMapInputData> {
  /**
   * TreeMap id, will be use for create customId for each node
   */
  id: string;

  /**
   * TreeMap width
   */
  width: number;

  /**
   * TreeMap height
   */
  height: number;

  /**
   * TreeMap data. Normally should have at least name, value and children.
   *
   * Example:
   *  interface TreeMapInPutData {
   *      name: string;
   *      value?: number;
   *      children?: Array<TreeMapInPutData>;
   *      className?: string;
   *  }
   */
  data: TreeMapInputData;

  /*
        Unit for values. For example MB
    */
  valueUnit?: string;

  /*
   * Format for the values
   * https://github.com/d3/d3-format#format
   * https://github.com/d3/d3-time-format if isTimeFormat
   */
  valueFormat?: string;

  /**
   * Hide breadcrumb.
   *
   * If you app doesn't use breadcrumb, you can pass down a ref
   * and use the methods: zoomOut, resetZoom
   */
  disableBreadcrumb?: boolean;

  /**
   * There are few color strategies for nodes:
   *    Depth: different color per depth
   *    Value: different color depends on how big / small is the value
   *    NumberOfChildren: different color depends on how many children node has
   *    OneEachChildren: one color per each top children, then range of colors from white to that one
   */
  colorModel?: ColorModel;

  /**
   * Don't show the top right corner box indicating number of children
   */
  hideNumberOfChildren?: boolean;

  /**
   * Don't show the value
   */
  hideValue?: boolean;

  /**
   * Overrides top div main class
   */
  className?: string;

  /**
   * Overrides svg class
   */
  svgClassName?: string;

  /**
   * Overrides node class
   */
  nodeClassName?: string;

  /**
   * Overrides breadcrumb class
   */
  breadCrumbClassName?: string;

  /**
   * Overrides svg style
   */
  svgStyle?: React.CSSProperties;

  /**
   * Overrides node style
   */
  nodeStyle?: React.CSSProperties;

  /**
   * Padding between nodes ( calculated by D3 )
   */
  paddingInner?: number;

  /**
   * Custom ScaleSequential from D3
   */
  customD3ColorScale?: ScaleSequential<string>;

  /**
   * Name for the property `name` included in data
   *
   * @default "name"
   */
  namePropInData?: string;

  /**
   * Name for the property `link` included in data
   *
   * @default "link"
   */
  linkPropInData?: string;

  /**
   * Name for the property `value` included in data
   *
   * @default "value"
   */
  valuePropInData?: string;

  /**
   * Name for the property `children` included in data
   *
   * @default "children"
   */
  childrenPropInData?: string;

  /**
   * Captures on zoom event
   */
  onZoom?: (
    zoomLevel: number,
    zoomId: number,
    breadcrumbItems: IBreadcrumbItem[]
  ) => void;

  /**
   * Triggers when TreeMap is mounted
   */
  onTreeMapDidMount?: (treeMap: TreeMap<TreeMapInputData>) => void;

  /**
   * Indicates where to place NumberOfChildren box
   *
   * @default NumberOfChildrenPlacement.BottomRight
   */
  numberOfChildrenPlacement: NumberOfChildrenPlacement;

  /**
   * If true when uses d3-time-format otherwise uses d3-format
   */
  isTimeFormat?: boolean;
}

export enum ColorModel {
  Depth,
  Value,
  NumberOfChildren,
  OneEachChildren,
}
