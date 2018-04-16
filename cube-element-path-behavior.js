import {dedupingMixin} from "@polymer/polymer/lib/utils/mixin.js";

/**
 * @demo ./demo/index.html
 * @polymerBehavior */
export const CubeElementPathBehavior = dedupingMixin(superClass => {
  class CubeElementPathBehavior extends superClass {
    getPath(element)
    {
      let node = element, path = [];
      do
      {
        path.push(node);
      }
      while(node = node.parentElement);
      return path;
    }
  }

  return CubeElementPathBehavior;
});
