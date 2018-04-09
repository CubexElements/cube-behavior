import '../polymer/polymer.js';

/** @polymerBehavior */
export const CubeElementPathBehavior = {
  getPath: function (element) {
    let node = element, path = [];
    do
    {
      path.push(node);
    }
    while(node = node.parentElement);
    return path;
  }
};