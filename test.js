var bootstrap = require("./loader.js");
bootstrap("*");
var stream = require("./stream.js");
var s = new stream.PassThrough();
s.write("bock");
console.log(s.read().toString());