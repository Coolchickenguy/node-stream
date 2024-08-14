// Old browsers shim
require("setimmediate");
// Put this first so primordials don't get a non-patched version of proxy or promise
// Mess with Proxys and Promises to make them compadable with utils and types
const {
  getProxyDetailsSymbol,
  getPromiseDetailsSymbol,
} = require("./bundle/internal/patchSymbols.js");
// Use for makeing a proy that dosen't register as a proxy
const oldProxy = Proxy;
// Intercept proxy creations and add a method to get the arguments that were passed to the proxy
globalThis.Proxy = new Proxy(Proxy, {
  construct(target, args) {
    var newProx = new target(new target(...args), {
      get(_prox, prop) {
        if (prop === getProxyDetailsSymbol) {
          return args;
        } else {
          return Reflect.get(...arguments);
        }
      },
    });
    return newProx;
  },
});
// Intercept promise decleratons
globalThis.Promise = new oldProxy(Promise, {
  construct(prom, args) {
    var newPromise = new prom(...args);
    newPromise[getPromiseDetailsSymbol] = args;
    return newPromise;
  },
});
// And thus ends my evil sceme of ruining global objects for my own nefarious purposes
// of stealing parameters from them!! HAHAHAHAHA!! 🙄 (jk)
// ( It's probably harmless-ish, it requires you to use a symbol to get to the params)
// The order of these steps is signifigent!
const internalBinding = require("./bundle/internal/internalBinding.js");
const process = require("./bundle/internal/process.js");
const EventEmitter = require("./bundle/events.js");
const warning = require("./bundle/internal/process/warning.js");
process.emitWarning = warning.emitWarning;
const {
  ObjectGetPrototypeOf,
  FunctionPrototypeCall,
  SymbolToStringTag,
  ObjectSetPrototypeOf,
  ObjectDefineProperty,
} = require("./bundle/internal/per_context/primordials.js");
const processProto = ObjectGetPrototypeOf(process);
ObjectSetPrototypeOf(processProto, EventEmitter.prototype);
FunctionPrototypeCall(EventEmitter, process);
ObjectDefineProperty(process, SymbolToStringTag, {
    __proto__: null,
    enumerable: false,
    writable: true,
    configurable: false,
    value: 'process',
});
process.on("warning",warning.onWarning)
ObjectDefineProperty(module, "exports", {
  get() {
    return process;
  },
  set(v) {
    process = v;
  },
  enumerable: false,
  configurable: true,
});
var debug = require("./bundle/internal/util/debuglog.js");
debug.initializeDebugEnv("*");
// Tell internal binding that debug has started
internalBinding("internal_fJ31hrh")();