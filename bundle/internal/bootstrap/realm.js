//Patch
//BOCK
var primordials = require("../per_context/primordials.js");var process = require("../process.js");var {builtinIds: avalable} = internalBinding("builtins");
module.exports = { BuiltinModule: {exsists : (id) => typeof avalable[id] != "undefined"}};