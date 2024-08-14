// Shim
require("queue-microtask");
const { process } = require("./meta.js");
module.exports = {
  ...process,
  __proto__:{},
  stdout: { write: console.log },
  stderr: { write: console.log },
  nextTick: (value, ...params) => queueMicrotask(() => value(...params)),
  platform: "linix",
  env: {},
  versions: { openssl: "", node: process.version.slice(1) },
  pid: Number(Math.random().toString().slice(2, 6)),
};
