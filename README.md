# Stream browser
The stream module from nodejs <!--VER-->,<!--VER-END-->, created as a polyfill for browsers.
( Also includes EventEmitter because stream uses it and a fs noop )
###### Notes: requires a buffer polyfill to be in use and does NOT support webstreams
# How to use on nodejs
> ###### Possibly as a polyfill for old nodejs versions?
```javascript
const stream = require("stream-browser");
// OR
import stream from "stream-browser";
// Or even
import promises from "stream-browser/promises";
// However you want to use streams
```
# How to use with webpack
Include in your config file:
#### Commonjs
```javascript
module.exports = {
  resolve: {
    fallback: {
      stream: require.resolve("stream-browser"),
      events: require.resolve("stream-browser/extras/events")
    }
  }
}
```
#### Esm
```javascript
import { fileURLToPath } from "url";
/**
 * Resolve a module
 * @param {string} specifier 
 */
function resolve(specifier){
  return fileURLToPath(import.meta.resolve(specifier));
}
export default {
  resolve: {
    fallback: {
      stream: resolve("stream-browser"),
      events: resolve("stream-browser/extras/events")
    }
  }
}

```
# Enabling debug
To enable debug, before using any part of this module ( With the exception of the fs noop ), run
```javascript
require("stream-browser/loader.js")(/*Debug settings string here*/);
```
If you enable all debug (By provideing "*"), you will see something like this:
```
INTERNALBINDING (PATCH) 3056: binding trace_events not found
INTERNALBINDING (PATCH) 3056: attempted to acess nonexsistent prop NODE_PERFORMANCE_MILESTONE_TIME_ORIGIN of binding performance.constants, returning blank proxy.
INTERNALBINDING (PATCH) 3056: attempted to acess nonexsistent prop NODE_PERFORMANCE_MILESTONE_TIME_ORIGIN_TIMESTAMP of binding performance.constants, returning blank proxy.
STREAM 3056: push <Buffer 62 6f 63 6b>
STREAM 3056: read undefined
STREAM 3056: need readable false
STREAM 3056: length less than watermark true
STREAM 3056: do read
```
The INTERNALBINDING messages are COMPLETELY normal ( They happen because I did not fully tree-shake so there is code that is never used but needs a binding that I did not polyfill because IT WON'T EVER GET USED. )

If you try to enable debug AFTER this polyfill gets used, you will see a mesage like this:
<p style="color:#d64343">(node:3056) [NODE_POLYFILL_BOOTSTRAP] DEBUGERROR001: Tryed to change debug settings
(Use `node --trace-warnings ...` to show where the warning was created)</p>
and the debug settings will not be updated.