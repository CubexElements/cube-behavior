/** @polymerBehavior */
export const CubeTouchEnabledBehavior = {
  properties:    {
    _isTouchDevice: {type: Boolean, value: function () {return this._touchEnabled();}}
  },
  _touchEnabled: function () {
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
};
