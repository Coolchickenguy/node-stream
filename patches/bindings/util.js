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
const ni = function () {
  throw new Error("Not implemented");
};
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
  [
    ...Object.getOwnPropertyNames(obj),
    ...Object.getOwnPropertySymbols(obj),
  ].filter(
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
          (_object, Key) => typeof Key != "string",
          (_object, Key) => typeof Key != "symbol",
        ],
        (...arg) => {
          console.log("err", arg);
          return true;
        }
      )(obj, key)
  );
const getConstructorName = (constructor) =>
  getPropsChainSafe(constructor, "constructor", "name");
// Not needed
const getExternalValue = ni;
const sleep = ni;
// Nodejs's code, just in javascript, not c++
const parseEnv = function parseEnv(input) {
  let lines = input;

  // Handle windows newlines "\r\n": remove "\r" and keep only "\n"
  lines = lines.replace(/\r/g, "");

  let content = lines.trim();

  const store = {};

  while (content.length > 0) {
    // Skip empty lines and comments
    if (content[0] === "\n" || /^ *#/m.test(content[0])) {
      const newline = content.indexOf("\n");
      if (newline !== -1) {
        content = content.slice(newline + 1);
        continue;
      }
    }

    // If there is no equal character, then ignore everything
    const equal = content.indexOf("=");
    if (equal === -1) {
      break;
    }

    let key = content.slice(0, equal).trim();
    content = content.slice(equal + 1).trim();

    if (key.length === 0) {
      break;
    }

    // Remove export prefix from key
    if (key.startsWith("export ")) {
      key = key.slice(7);
    }

    // SAFETY: Content is guaranteed to have at least one character
    if (content.length === 0) {
      // In case the last line is a single key without value
      // Example: KEY= (without a newline at the EOF)
      store[key] = "";
      break;
    }

    // Expand new line if \n it's inside double quotes
    // Example: EXPAND_NEWLINES = 'expand\nnew\nlines'
    if (content[0] === '"') {
      const closingQuote = content.indexOf('"', 1);
      if (closingQuote !== -1) {
        let value = content.slice(1, closingQuote);
        let multiLineValue = value.replace(/\\n/g, "\n");

        store[key] = multiLineValue;
        content = content.slice(content.indexOf("\n", closingQuote + 1));
        continue;
      }
    }

    // Check if the value is wrapped in quotes, single quotes or backticks
    if ("'\"`".includes(content[0])) {
      const closingQuote = content.indexOf(content[0], 1);

      // Check if the closing quote is not found
      // Example: KEY="value
      if (closingQuote === -1) {
        // Check if newline exist. If it does, take the entire line as the value
        // Example: KEY="value\nKEY2=value2
        // The value pair should be `"value`
        const newline = content.indexOf("\n");
        if (newline !== -1) {
          const value = content.slice(0, newline);
          store[key] = value;
          content = content.slice(newline);
        }
      } else {
        // Example: KEY="value"
        const value = content.slice(1, closingQuote);
        store[key] = value;
        // Select the first newline after the closing quotation mark
        // since there could be newline characters inside the value.
        content = content.slice(content.indexOf("\n", closingQuote + 1));
      }
    } else {
      // Regular key value pair.
      // Example: `KEY=this is value`
      const newline = content.indexOf("\n");

      let value;
      if (newline !== -1) {
        value = content.slice(0, newline);
        const hashCharacter = value.indexOf("#");
        // Check if there is a comment in the line
        // Example: KEY=value # comment
        // The value pair should be `value`
        if (hashCharacter !== -1) {
          value = content.slice(0, hashCharacter);
        }
        content = content.slice(newline);
      } else {
        // In case the last line is a single key/value pair
        // Example: KEY=VALUE (without a newline at the EOF)
        value = content;
      }

      value = value.trim();
      store[key] = value;
    }
  }

  return store;
};
const arrayBufferViewHasBuffer = ni;
const guessHandleType = ni;
const isArrayBufferView = (buff) => ArrayBuffer.isView(buff);
const isTypedArray = (val) => isArrayBufferView(val) && !types.isDataView(val);
const isUint8Array = (arr) =>
  getPropsChainSafe(arr, "constructor") === Uint8Array;
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
