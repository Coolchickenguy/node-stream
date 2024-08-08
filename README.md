# Stream browser
The stream module from nodejs <!--VER-->v20.14.4<!--VER-END-->, created as a polyfill for browsers.
( Also includes EventEmitter because stream uses it )
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
