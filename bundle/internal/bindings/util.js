const types = require("./types.js"),
  { util } = require("./constants.js"),
  {
    local: { getAllEntries, getPropsChainSafe, vISt },
  } = types;
const {
  getProxyDetailsSymbol,
  getPromiseDetailsSymbol,
} = require("../patchSymbols.js");
const switcher = (value, cases, values, defaultValue) =>
  cases.includes(value) ? values[cases.indexOf(value)] : defaultValue;
const isChecker = (prop) => (obj, key) =>
  Object.getOwnPropertyDescriptor(obj, key)[prop];
const validate = (types, args) => {
  if (types.map((v, i) => typeof args[i] == v).includes(false)) {
    throw new Error("Internal error: arg type check failed");
  }
  return true;
};
const truthy = (val) => !!val;
const ni = function(){throw new Error("Not implemented");};
// Start main implemintation
const getPromiseDetails = (prom) =>
  getPropsChainSafe(prom, getPromiseDetailsSymbol);
const getProxyDetails = (prox) =>
  getPropsChainSafe(prox, getProxyDetailsSymbol);
const getCallerLocation = ni;
const isArrayBufferDetached = (val) => truthy(getPropsChainSafe(val, detached));
// If anyone knows how to implement this function, which can get the values of a weakSet or weakMap, please open a pr
const previewEntries = ni;
const getOwnNonIndexProperties = (obj, code) =>
  validate(["object", "number"], [obj, code]) &&
  [...Object.getOwnPropertyNames(obj),...Object.getOwnPropertySymbols(obj)].filter(
    (key) =>
      (typeof key == "symbol" || isNaN(key)) &&
      switcher(
        code,
        [
          util.constants.ALL_PROPERTIES,
          util.constants.ONLY_WRITABLE,
          util.constants.ONLY_ENUMERABLE,
          util.constants.ONLY_CONFIGURABLE,
          util.constants.SKIP_STRINGS,
          util.constants.SKIP_SYMBOLS,
        ],
        [
          () => true,
          isChecker("writable"),
          isChecker("enumerable"),
          isChecker("configurable"),
          (_object,Key) => typeof Key != "string",
          (_object,Key) => typeof Key != "symbol",
        ],
        (...arg) => {
          console.log("err", arg);
          return true;
        }
      )(obj,key)
  );
const getConstructorName = (constructor) => getPropsChainSafe(constructor,"constructor","name");
// Not needed
const getExternalValue = ni;
const sleep = ni;
const parseEnv = ni;
const arrayBufferViewHasBuffer = ni;
const guessHandleType = ni;
const isArrayBufferView = (buff) => ArrayBuffer.isView(buff);
const isTypedArray = (val) => isArrayBufferView(val) && !types.isDataView(val);
const isUint8Array = (arr) => getPropsChainSafe(arr,"constructor") === Uint8Array;
module.exports = {
  getPromiseDetails,
  getProxyDetails,
  getCallerLocation,
  isArrayBufferDetached,
  previewEntries,
  getOwnNonIndexProperties,
  getConstructorName,
  getExternalValue,
  sleep,
  parseEnv,
  arrayBufferViewHasBuffer,
  guessHandleType,
  isArrayBufferView,
  isTypedArray,
  isUint8Array,
  ...types,
  ...util,
};
