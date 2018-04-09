/** @polymerBehavior */
export const CubeLogBehavior = {
  __log: function () {
    Function.apply.call(console.log, console, Array.prototype.slice.call(arguments))
  }
};
