// Shim
require("queue-microtask");
module.exports = { stdout: "chicken", stderr: "dance", nextTick: (value,...params) => queueMicrotask(() => value(...params)), platform: "linix", env: {} };