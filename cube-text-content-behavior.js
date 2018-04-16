import {dedupingMixin} from "@polymer/polymer/lib/utils/mixin.js";
import {CubeIteratorBehavior} from "./cube-iterator-behavior.js";

/** @polymerBehavior */
export const CubeTextContentBehavior = dedupingMixin(superClass => {
  class CubeTextContentBehavior extends CubeIteratorBehavior(superClass) {
    getInnerText()
    {
      let output = "";
      this.iterate(
        this.getEffectiveChildNodes(),
        function (i) {
          if(i.nodeType === 3 && i.nodeValue.trim())
          {
            output += i.nodeValue.trim();
          }
        }
      );
      return output;
    }
  }

  return CubeTextContentBehavior;
});
