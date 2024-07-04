import * as bock from "./temp/node-main/lib/internal/per_context/primordials.js";
import stuff from "internal/test/binding";
const types = stuff.internalBinding("types");
console.log(types.isModuleNamespaceObject(bock),typeof bock,bock[Symbol.toStringTag],types[Symbol.toStringTag])
