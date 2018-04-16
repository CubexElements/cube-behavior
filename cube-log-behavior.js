import {dedupingMixin} from "@polymer/polymer/lib/utils/mixin.js";

/** @polymerBehavior */
export const CubeLogBehavior = dedupingMixin(superClass => {
  class CubeLogBehavior extends superClass {
    __log()
    {
      Function.apply.call(console.log, console, Array.prototype.slice.call(arguments))
    }
  }

  return CubeLogBehavior;
});
