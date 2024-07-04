const setImmediate = require("setimmediate");
module.exports = { stdout: "chicken", stderr: "dance", nextTick: setImmediate, platform: "linix", env: {} };