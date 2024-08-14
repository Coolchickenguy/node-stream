const { ObjectPrototypeToString } = typeof primordials == "undefined" ? {ObjectPrototypeToString:Object.prototype.toString} : primordials;
const { getProxyDetailsSymbol } = require("../patchSymbols.js");
const AsyncFunction = async function () {}.constructor;
const GeneratorFunction = function* () {}.constructor;
function getAllEntries(obj) {
  var props = [];
  var ref = Object.assign({}, obj);
  do {
    Object.getOwnPropertyNames(ref).forEach(function (prop) {
      if (props.indexOf(prop) === -1) {
        props.push(prop);
      }
    });
    ref = Object.getPrototypeOf(ref);
  } while (ref);
  // Proto crashes function if useing DOMException error
  return props.filter((v) => v != "__proto__").map((p) => [p, obj[p]]);
}
/**
 *
 * @param { any } object A object to get the propertys from
 * @param  {...string | number} props The propertys to get from the object
 * @returns { any } The resulting value ( Undefined if any of the propertys do not exsist on the object )
 */
function getPropsChainSafe(object, ...props) {
  var ref = object;
  while (typeof ref != "undefined" && typeof ref[props[0]] != "undefined") {
    ref = ref[props.shift()];
  }
  return props.length == 0 ? ref : undefined;
}
/**
 *
 * @param { any[] } types
 * @returns { Function } A instanceof checker
 */
const vISt =
  (...types) =>{
    types.filter(v => typeof v != "undefined");
  return (val) =>
    types.map((t) => val instanceof t).includes(true);
  }
const isEntirelyNative = (value) =>
  !getAllEntries(value)
    .map(([key, val]) =>
      typeof val == "function"
        ? /\{\s+\[native code\]/.test(Function.prototype.toString.call(val))
        : undefined
    )
    .includes(false);
// TODO: add isExernal, whatever THAT checks for
const isDate = vISt(Date);
const isArgumentsObject = (value) => ObjectPrototypeToString(value) === "[object Arguments]";
// TODO: posibly use primordials?
// Same check as nodejs
const isBigIntObject = vISt(BigInt);
const isBooleanObject = vISt(Boolean);
const isNumberObject = vISt(Number);
const isStringObject = vISt(String);
// This Matches nodejs
// Is nodejs MADE of bugs?
// (No)
const isSymbolObject = vISt(Symbol);
const isNativeError = vISt(Error);
const isRegExp = vISt(RegExp);
const isAsyncFunction = vISt(AsyncFunction);
const isGeneratorFunction = vISt(GeneratorFunction);
const isGeneratorObject = (val) =>
  getPropsChainSafe(val, "constructor", "constructor") == GeneratorFunction;
const isPromise = vISt(Promise);
const isMap = vISt(Map);
const isSet = vISt(Set);
const isMapIterator = (val) =>
  getPropsChainSafe(val, Symbol.toStringTag) === "Map Iterator";
const isSetIterator = (val) =>
  getPropsChainSafe(val, Symbol.toStringTag) === "Set Iterator";
const isWeakMap = vISt(WeakMap);
const isWeakSet = vISt(WeakSet);
const isArrayBuffer = vISt(ArrayBuffer);
const isDataView = vISt(DataView);
const isSharedArrayBuffer = vISt(SharedArrayBuffer);
const isProxy = (val) =>
  typeof getPropsChainSafe(val, getProxyDetailsSymbol) !== "undefined";
const isModuleNamespaceObject = (val) =>
  getPropsChainSafe(val, Symbol.toStringTag) === "Module";
const isAnyArrayBuffer = vISt(ArrayBuffer, ...(SharedArrayBuffer ? [SharedArrayBuffer] : []));
const isBoxedPrimitive = vISt(Number, String, Boolean, BigInt, Symbol);
const isFunction = vISt(Function);
module.exports = {
  isEntirelyNative,
  isDate,
  isArgumentsObject,
  isBigIntObject,
  isBooleanObject,
  isNumberObject,
  isStringObject,
  isSymbolObject,
  isNativeError,
  isRegExp,
  isAsyncFunction,
  isGeneratorFunction,
  isGeneratorObject,
  isPromise,
  isMap,
  isSet,
  isMapIterator,
  isSetIterator,
  isWeakMap,
  isWeakSet,
  isArrayBuffer,
  isDataView,
  isSharedArrayBuffer,
  isProxy,
  isModuleNamespaceObject,
  isAnyArrayBuffer,
  isBoxedPrimitive,
  isFunction,
  local:{
  getAllEntries,
  getPropsChainSafe,
  vISt,
  },
};