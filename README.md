# react-d3-treemap

TreeMap component built with [D3 Treemap](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap)
and [React](https://facebook.github.io/react) based on [Mike Bostock´s Treemap](https://bl.ocks.org/mbostock/911ad09bdead40ec0061).

[![npm version](https://badge.fury.io/js/react-d3-treemap.svg)](https://badge.fury.io/js/react-d3-treemap)
[![Code Climate](https://codeclimate.com/github/jquintozamora/react-d3-treemap/badges/gpa.svg)](https://codeclimate.com/github/jquintozamora/react-d3-treemap)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](Readme.md#want-to-contribute)

![React-d3-treemap-gif](./assets/treeMap.1.0.26.gif)

## DEMO

[React D3 Treemap demo](https://jquintozamora.github.io/react-d3-treemap)

## Features

- React for painting SVG
- D3 for doing the maths calculations

## Installation

Steps to use react-d3-treemap in your React project

### 1.Install from NPM

```
npm install --save react-d3-treemap
```

### 2. Import and use in your application

```js
import TreeMap from "react-d3-treemap";
// Include its styles in you build process as well
import "react-d3-treemap/dist/react.d3.treemap.css";
```

### 3. Usage

```ts
interface TreeMapInPutData {
  name: string;
  value?: number;
  children?: Array<TreeMapInPutData>;
  className?: string;
}

<TreeMap<TreeMapInPutData>
    id="myTreeMap"
    width={500}
    height={400}
    data={<my data matching TreeMapInputData interface>}
    valueUnit={"MB"}
/>
```

## Props

```ts
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
   * Color for text and children counter when background is dark
   *
   * @default white
   */
  darkNodeTextColor?: string;

  /**
   * Color for node border when background is dark
   *
   * @default white
   */
  darkNodeBorderColor?: string;

  /**
   * Color for text and children counter when background is light
   *
   * @default black
   */
  lightNodeTextColor?: string;

  /**
   * Color for node border when background is dark
   *
   * @default black
   */
  lightNodeBorderColor?: string;
  
  /**
   * Override value text for node 
   */
  valueFn?: (value: number) => string

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

  /**
   * Tooltip offset X
   *
   * @default 0
   */
  tooltipOffsetX?: number;

  /**
   * Tooltip offset Y
   *
   * @default 0
   */
  tooltipOffsetY?: number;

  /**
   * Number of levels to display in TreeMap
   *
   * @default 1
   */
  levelsToDisplay?: number;
```

## App sample

You can see an example of App [here](https://github.com/jquintozamora/react-d3-treemap/blob/master/src/App/App.tsx).

## Data sample

You can see an example of data [here](https://github.com/jquintozamora/react-d3-treemap/blob/master/src/data/data.ts).

## TypeScript sample

I created a [TypeScript consume sample for React D3 Treemap](https://github.com/jquintozamora/react-d3-treemap-consume-typescript).

## License

BSD 3-Clause License

Copyright (c) 2021, [José Quinto](https://blog.josequinto.com)
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

- Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

- Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

- Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
