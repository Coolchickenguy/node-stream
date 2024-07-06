// Shim
require("queue-microtask");
module.exports = { stdout: "chicken", stderr: "dance", nextTick: queueMicrotask, platform: "linix", env: {} };