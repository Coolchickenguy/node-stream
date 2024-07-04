var {builtinIds: avalable} = internalBinding("builtins");
module.exports = { BuiltinModule: {exsists : (id) => typeof avalable[id] != "undefined"}};