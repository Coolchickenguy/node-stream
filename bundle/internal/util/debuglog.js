//Patch
//BOCK
var primordials = require("../per_context/primordials.js");var process = require("../process.js");var {StringPrototypeToUpperCase,StringPrototypeToLowerCase,StringPrototypeReplace,StringPrototypeReplaceAll,RegExpPrototypeExec,RegExp,ObjectDefineProperty,SafeArrayIterator} = primordials;
const {format} = require('./inspect');
var testEnabled;
var debugImpls;
function debugLogger(set) {
    return function(...args) {
        const msg = format(...args);
         console.log(format('%s: %s\n', set, msg));
    };
};

function initializeDebugEnv(debugEnv) {
    var exsists = typeof debugImpls != "undefined";
    if(!exsists){
        debugImpls = { __proto__: null };
    }
    if (debugEnv) {
      // This will be run AFTER page start so primordials are NESSISARY
      debugEnv = StringPrototypeReplaceAll(StringPrototypeReplaceAll(StringPrototypeReplace(debugEnv,/[|\\{}()[\]^$+?.]/g, '\\$&'),'*', '.*'),',', '$|^');
      const debugEnvRegex = new RegExp(`^${debugEnv}$`, 'i');
      testEnabled = (str) => RegExpPrototypeExec(debugEnvRegex, str) !== null;
      if(exsists){
        Object.entries(debugImpls).map(([name]) => [name,testEnabled(name) ? debugLogger(name) : noop])
      }
    } else {
      testEnabled = () => false;
      Object.keys(debugImpls,(key) => {
        debugImpls[key] = noop;
      });
    }
  }
const noop = () => {};
// Emits warning when user sets
// NODE_DEBUG=http or NODE_DEBUG=http2.
function emitWarningIfNeeded(set) {
    if ('HTTP' === set || 'HTTP2' === set) {
      process.emitWarning('Setting the NODE_DEBUG environment variable ' +
        'to \'' + StringPrototypeToLowerCase(set) + '\' can expose sensitive ' +
        'data (such as passwords, tokens and authentication headers) ' +
        'in the resulting log.');
    }
  }
  /**
   * 
   * @param { boolean } enabled If the debug is enabled
   * @param { string } set 
   * @param { any } args UNUSED
   * @returns 
   */
function debuglogImpl(enabled, set, args) {
    if (debugImpls[set] === undefined) {
      if (enabled) {
        emitWarningIfNeeded(set);
        debugImpls[set] = debugLogger(set);
      } else {
        debugImpls[set] = noop;
      }
    }
    return debugImpls[set];
  }
function debuglog(set, cb) {
    function init() {
      set = StringPrototypeToUpperCase(set);
      enabled = testEnabled(set);
    }
    let debug = (...args) => {
      init();
      // Only invokes debuglogImpl() when the debug function is
      // called for the first time.
      debug = debuglogImpl(enabled, set);
      if (typeof cb === 'function')
        cb(debug);
      switch (args.length) {
        case 1: return debug(args[0]);
        case 2: return debug(args[0], args[1]);
        default: return debug(...new SafeArrayIterator(args));
      }
    };
    let enabled;
    let test = () => {
      init();
      // Allow testing to give diffrent result. Required due to non-static env
      //test = () => enabled;
      return enabled;
    };
    const logger = (...args) => {
      switch (args.length) {
        case 1: return debug(args[0]);
        case 2: return debug(args[0], args[1]);
        default: return debug(...new SafeArrayIterator(args));
      }
    };
    ObjectDefineProperty(logger, 'enabled', {
      __proto__: null,
      get() {
        return test();
      },
      configurable: true,
      enumerable: true,
    });
    return logger;
  }
module.exports = {debuglog,initializeDebugEnv};