//Patch
//BOCK
var primordials = require("./per_context/primordials.js");var process = require("./process.js");'use strict';

let error;
function lazyError() {
  if (!error) {
    error = require('./errors').codes.ERR_INTERNAL_ASSERTION;
  }
  return error;
}

function assert(value, message) {
  if (!value) {
    const ERR_INTERNAL_ASSERTION = lazyError();
    throw new ERR_INTERNAL_ASSERTION(message);
  }
}

function fail(message) {
  const ERR_INTERNAL_ASSERTION = lazyError();
  throw new ERR_INTERNAL_ASSERTION(message);
}

assert.fail = fail;

module.exports = assert;
