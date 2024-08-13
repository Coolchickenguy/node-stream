// Shim
require("queue-microtask");
module.exports = {
  stdout: { write: console.log },
  stderr: { write: console.log },
  nextTick: (value, ...params) => queueMicrotask(() => value(...params)),
  platform: "linix",
  env: {},
  versions: { openssl: "A version" },
  pid: Number(Math.random().toString().slice(2, 6)),
};
