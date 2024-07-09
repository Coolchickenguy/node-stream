# Stream browser
The stream module from nodejs v20.14.4, created as a polyfill for browsers.
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
```
{
  resolve: {
    fallback: {
      stream: require.resolve("stream-browser"),
      events: require.resolve("stream-browser/extras/events")
    }
  }
}
```
#### Esm
```
{
  resolve: {
    fallback: {
      stream: import.meta.resolve("stream-browser"),
      events: import.meta.resolve("stream-browser/extras/events")
    }
  }
}

```
