import {dedupingMixin} from "@polymer/polymer/lib/utils/mixin.js";

/** @polymerBehavior */
export const CubeTouchEnabledBehavior = dedupingMixin(superClass => {
  class CubeTouchEnabledBehavior extends superClass {
    static get properties()
    {
      return {
        _isTouchDevice: {type: Boolean, value: function () {return this._touchEnabled();}}
      }
    }

    _touchEnabled()
    {
      try
      {
        document.createEvent('TouchEvent');
        return true;
      }
      catch(e)
      {
        return false;
      }
    }
  }

  return CubeTouchEnabledBehavior;
});