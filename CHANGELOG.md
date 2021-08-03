## 1.0.28 (2021-08-03)
- Configure breaking words RegExp via `splitRegExp` prop

## 1.0.27 (2021-03-31)
- Solve issue breaking down word by using "-"
- Expose `paddingOuter`
- Refactor padding inner solving issue displaying level 4

## 1.0.26 (2021-03-26)

- Add `tooltipOffsetX`and `tooltipOffsetY`
- Add `levelsToDisplay`

## 1.0.25 (2021-03-25)

- Remove temp tooltip string

## 1.0.24 (2021-03-25)

- Hide text when node height < text height
- Add custom Tooltip implementation and some props:

  ```ts
   /**
    * Tooltip placement. If none is specified then is automatic depending on
    * the quadrant of the treeMap
    */
    tooltipPlacement?: TooltipPlacement;

    /**
     * Tooltip custom css class
    */
    tooltipClassName?: string;

    /**
     * Disable custom tooltip
    *
    * @default false
    */
    disableTooltip?: boolean
  ```

## 1.0.23 (2021-03-24)

- Remove `isTimeFormat`
- Expose `formatFn` to overrides the rendering of value in nodes

## 1.0.22 (2021-03-23)

- Solve wrapping text issue
- Limit number of text rows to show depending on the hight of the node
- Set ratio(1) for d3 layout
- Add d3-time-format and `isTimeFormat` prop to enable it
- Add props to configure dark and light colors for text and border
  ```ts
  darkNodeTextColor?: string;
  darkNodeBorderColor?: string;
  lightNodeTextColor?: string;
  lightNodeBorderColor?: string;
  ```

## 1.0.21 (2021-03-23)

- Enable Tree Shaking and reduce bundle size
- UNSAFE_componentWillReceiveProps warning

## 1.0.19 (2021-03-21)

- Add `onTreeMapDidMount`
- Add `numberOfChildrenPlacement`
- Export `NumberOfChildrenPlacement` enum
- Solve bug with paddingTop and paddingLeft
- Implement wrap of characters and ellipsis when text doesn't fit in the node

## 1.0.18 (2021-03-20)

- Add App Sample to Readme.md
- Solve convert to RBG color issue
- Solve domain issue with color
- Add `onZoom` for listening to changes in the zoom
- Enable fontSize, paddingTop and paddingLeft for Nodes

## 1.0.16 (2021-03-20)

- Refactor CSS.

  - Not using css modules anymore, just normal css-loader config
  - className and styles can be override

- Refactor Typings

  - Remove most of the cases we were using any
  - TreeMap can be typed
    - <TreeMap<TreeMapInPutData> ... />
  - Add typing example in App.tsx

- New props:

  - Styling
    - className?: string;
    - svgClassName?: string;
    - nodeClassName?: string;
    - svgStyle?: React.CSSProperties;
    - nodeStyle?: React.CSSProperties;
    - paddingInner?: number;
  - Color
    - Expose color scheme supporting scaleSequential and d3-scale-chromatic
    - customD3ColorScale?: ScaleSequential<string>;
  - Input Data
    - namePropInData?: string;
    - linkPropInData?: string;
    - valuePropInData?: string;
    - childrenPropInData?: string;

- Expose new methods: resetZoom, zoomOut and getZoomLevel

  - Can be called via ref:

    ```ts
    const treeMapRef: React.RefObject<TreeMap<TreeMapInPutData>>;

    <TreeMap<TreeMapInPutData>
      ref={treeMapRef}
      //...
    />;

    treeMapRef.current.resetZoom();
    ```

- Refactor node count label in the corner to allow rounded corner

- Disable animated as it was increasing bundle size significantly

- Remove styled-components as it was was also increasing bundle size just for breadcrumb

- use yarn

## 1.0.15

- React for painting SVG
- D3 for doing the maths calculations
