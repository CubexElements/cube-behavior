import '../polymer/polymer.js';

/** @polymerBehavior */
export const CubeIteratorBehavior = {
  iterate: function (arr, callback) {
    let i, superClass,
      classType = /\[object (.+)]/.exec(Object.prototype.toString.call(arr))[1];
    switch(classType)
    {
      case 'String':
        superClass = '';
        break;
      case 'Array':
        superClass = [];
        break;
      case 'Object':
        superClass = {};
        break;
      default:
        superClass = new classType.constructor;
    }
    for(i in arr)
    {
      if(arr.hasOwnProperty(i) && !superClass.hasOwnProperty(i))
      {
        let retVal = callback(arr[i], i, arr);
        if(typeof(retVal) !== 'undefined')
        {
          return retVal;
        }
      }
    }
  }
};
