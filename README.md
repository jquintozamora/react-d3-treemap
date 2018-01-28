# react-d3-treemap
TreeMap component built with [D3 Treemap](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemap)
and [React](https://facebook.github.io/react) based on [Mike Bostock´s Treemap](https://bl.ocks.org/mbostock/911ad09bdead40ec0061).


[![npm version](https://badge.fury.io/js/react-d3-treemap.svg)](https://badge.fury.io/js/react-d3-treemap)
[![Code Climate](https://codeclimate.com/github/jquintozamora/react-d3-treemap/badges/gpa.svg)](https://codeclimate.com/github/jquintozamora/react-d3-treemap)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](Readme.md#want-to-contribute)

[![NPM](https://nodei.co/npm/react-d3-treemap.png?downloads=true)](https://nodei.co/npm/react-d3-treemap/)

![React-d3-treemap-gif](./assets/react-d3-treemap.gif)

## DEMO
[React D3 Treemap demo](https://jquintozamora.github.io/react-d3-treemap)

## Features
- React for painting SVG
- D3 for doing the maths calculations
- [Styled-Components](https://github.com/styled-components/styled-components)
- Using [React-motion](https://github.com/chenglou/react-motion) for animations
  - Good combination using: d3, React, React-Motion
  - ReactTransitionGroup to be deprecated: https://github.com/facebook/react/issues/1368
  - [Playing with D3 Version 4, React, React-Motion](https://medium.com/@ilikepiecharts/playing-with-d3-version-4-react-react-motion-3d04c6eb21c9#.25pnrcyg3)

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
```js
  <TreeMap
      height={500}
      width={800}
      data={data}
      valueUnit={"MB"}
  />
```
## Data sample
You can see an example of data [here](https://github.com/jquintozamora/react-d3-treemap/blob/master/src/data/data.ts).

## TypeScript sample
I created a [TypeScript consume sample for React D3 Treemap](https://github.com/jquintozamora/react-d3-treemap-consume-typescript).

## TODOs
- Make it [responsive](https://truongtx.me/2016/08/20/moving-away-from-d3js-im-using-reactjs-for-dom-manipulation-now)
- Add @types


## License
BSD 3-Clause License

Copyright (c) 2017, [José Quinto](https://blog.josequinto.com)
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
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
