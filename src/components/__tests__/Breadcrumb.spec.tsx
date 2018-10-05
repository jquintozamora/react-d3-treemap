import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-dom/test-utils";

const { Breadcrumb } = require("../Breadcrumb/Breadcrumb");

it("Breadcrumb has items inside", () => {
  // Render a checkbox with label in the document
  const items = [{ text: "hi", key: "one" }, { text: "hello", key: "two" }];
  const bc: any = TestUtils.renderIntoDocument(
    <Breadcrumb
      items={items}
      bgColor="black"
      hoverBgColor="white"
      currentBgColor="blue"
    />
  );
  const bcNode: any = ReactDOM.findDOMNode(bc);
  expect(bcNode.textContent).toEqual("hihello");
});
