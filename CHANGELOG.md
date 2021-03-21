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