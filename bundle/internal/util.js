//Patch
//BOCK
var primordials = require("./per_context/primordials.js");var process = require("./process.js");const {
    ArrayPrototypePush,
    ObjectDefineProperties,
    ObjectDefineProperty,
    ObjectGetOwnPropertyDescriptors,
    ObjectGetPrototypeOf,
    ObjectSetPrototypeOf,
    ObjectValues,
    Promise,
    ReflectApply,
    Symbol,
    SymbolFor,
    ObjectFreeze,
    StringPrototypeReplace,
  } = primordials;
function isPromise(value) {
    return value instanceof Promise;
}
const kCustomPromisifiedSymbol = SymbolFor('nodejs.util.promisify.custom');
const kCustomPromisifyArgsSymbol = Symbol('customPromisifyArgs');

let validateFunction;

function promisify(original) {

  if (original[kCustomPromisifiedSymbol]) {
    const fn = original[kCustomPromisifiedSymbol];


    return ObjectDefineProperty(fn, kCustomPromisifiedSymbol, {
      __proto__: null,
      value: fn, enumerable: false, writable: false, configurable: true,
    });
  }

  // Names to create an object from in case the callback receives multiple
  // arguments, e.g. ['bytesRead', 'buffer'] for fs.read.
  const argumentNames = original[kCustomPromisifyArgsSymbol];

  function fn(...args) {
    return new Promise((resolve, reject) => {
      ArrayPrototypePush(args, (err, ...values) => {
        if (err) {
          return reject(err);
        }
        if (argumentNames !== undefined && values.length > 1) {
          const obj = {};
          for (let i = 0; i < argumentNames.length; i++)
            obj[argumentNames[i]] = values[i];
          resolve(obj);
        } else {
          resolve(values[0]);
        }
      });
      if (isPromise(ReflectApply(original, this, args))) {
        /*process.emitWarning('Calling promisify on a function that returns a Promise is likely a mistake.',
                            'DeprecationWarning', 'DEP0174');*/
                            console.warn('Calling promisify on a function that returns a Promise is likely a mistake.',
                            'DeprecationWarning', 'DEP0174');
      }
    });
  }

  ObjectSetPrototypeOf(fn, ObjectGetPrototypeOf(original));

  ObjectDefineProperty(fn, kCustomPromisifiedSymbol, {
    __proto__: null,
    value: fn, enumerable: false, writable: false, configurable: true,
  });

  const descriptors = ObjectGetOwnPropertyDescriptors(original);
  const propertiesValues = ObjectValues(descriptors);
  for (let i = 0; i < propertiesValues.length; i++) {
    // We want to use null-prototype objects to not rely on globally mutable
    // %Object.prototype%.
    ObjectSetPrototypeOf(propertiesValues[i], null);
  }
  return ObjectDefineProperties(fn, descriptors);
}

promisify.custom = kCustomPromisifiedSymbol;
const kEnumerableProperty = { __proto__: null };
kEnumerableProperty.enumerable = true;
ObjectFreeze(kEnumerableProperty);

const customInspectSymbol = SymbolFor('nodejs.util.inspect.custom');
function isError(e) {
  return e instanceof Error;
}
// The built-in Array#join is slower in v8 6.0
function join(output, separator) {
  let str = '';
  if (output.length !== 0) {
    const lastIndex = output.length - 1;
    for (let i = 0; i < lastIndex; i++) {
      // It is faster not to use a template string here
      str += output[i];
      str += separator;
    }
    str += output[lastIndex];
  }
  return str;
}
const colorRegExp = /\u001b\[\d\d?m/g;
function removeColors(str) {
  return StringPrototypeReplace(str, colorRegExp, '');
}
module.exports = { promisify, kEnumerableProperty, customInspectSymbol, isError, join, removeColors,};
