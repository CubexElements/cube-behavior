import {CubeIteratorBehavior} from "./cube-iterator-behavior.js";

/** @polymerBehavior */
export const CubeTextContentBehavior = [
  CubeIteratorBehavior,
  {
    getInnerText: function () {
      let output = "";
      this.iterate(
        this.getEffectiveChildNodes(),
        function (i) {
          if(i.nodeType == 3 && i.nodeValue.trim())
          {
            output += i.nodeValue.trim();
          }
        }
      );
      return output;
    }
  }
];
