// More constants!
module.exports.util = {"privateSymbols":{"arrow_message_private_symbol":Symbol("node:arrowMessage"),"contextify_context_private_symbol":Symbol("node:contextify:context"),"decorated_private_symbol":Symbol("node:decorated"),"host_defined_option_symbol":Symbol("node:host_defined_option_symbol"),"napi_type_tag":Symbol("node:napi:type_tag"),"napi_wrapper":Symbol("node:napi:wrapper"),"untransferable_object_private_symbol":Symbol("node:untransferableObject"),"exit_info_private_symbol":Symbol("node:exit_info_private_symbol"),"promise_trace_id":Symbol("node:promise_trace_id"),"require_private_symbol":Symbol("node:require_private_symbol")},"constants":{"kPending":0,"kFulfilled":1,"kRejected":2,"kExiting":0,"kExitCode":1,"kHasExitCode":2,"ALL_PROPERTIES":0,"ONLY_WRITABLE":1,"ONLY_ENUMERABLE":2,"ONLY_CONFIGURABLE":4,"SKIP_STRINGS":8,"SKIP_SYMBOLS":16},"shouldAbortOnUncaughtToggle":{"0":0}};
/*
How to dump UTIL
!!Run node with --expose-internals flag!!

const { internalBinding } = require('internal/test/binding');
const util = internalBinding("util");
const symbolJSON = require("./symbolJSON.js");
console.log(symbolJSON(util));

( paste into the UTIL export)
*/
