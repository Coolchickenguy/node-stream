// Old browsers shim
require("setimmediate");
// Mess with Proxys and Promises to make them compadable with utils and types
const {getProxyDetailsSymbol, getPromiseDetailsSymbol} = require("./bundle/internal/patchSymbols.js");
const process = require("./bundle/internal/process.js");
Object.defineProperty(globalThis,"__nodejs_runtime__",{get(){return process},set(v){process = v;}});
// Use for makeing a proy that dosen't register as a proxy
const oldProxy = Proxy;
// Intercept proxy creations and add a method to get the arguments that were passed to the proxy
globalThis.Proxy = new Proxy(Proxy, {
    construct(target, args) {
        var newProx = new target(new target(...args), {
            get(prox, prop) {
                if (prop == getProxyDetailsSymbol) {
                    return args;
                } else {
                    return Reflect.get(...arguments);
                }
            },
            set() {
                return Reflect.set(...arguments);
            }
        });
        return newProx;
    }
});
// Intercept promise decleratons
globalThis.Promise = new oldProxy(Promise,{
    construct(prom,args){
        var newPromise = new prom(...args);
        newPromise[getPromiseDetailsSymbol] = args;
        return newPromise;
    }
});
// And thus ends my evil sceme of ruining global objects for my own nefarious purposes 
// of stealing parameters from them!! HAHAHAHAHA!! 🙄 (jk) 
// ( It's probably harmless-ish, it requires you to use a symbol to get to the params)
var debug = require("./bundle/internal/util/debuglog.js");
debug.initializeDebugEnv("*");