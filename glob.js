const fs = require("fs");
const picomatch = require("picomatch");
const { join } = require("path");
/**
 *
 * @param {any[]} array
 * @param {number} depth
 * @returns { any[] }
 */
module.exports.deleteFlat = function deleteFlat(array, depth) {
  if (depth < 1) {
    return array;
  } else {
    return deleteFlat(array.filter((v) => Array.isArray(v)).flat(1), depth - 1);
  }
};
function exsists(val) {
  return typeof val !== "undefined";
}
/**
 *
 * @param { string } path The path to read
 * @param { number } cut How deep to trim tree
 * @param { boolean } flat Private ( Tells function not to flatten array )
 * @param { string } remain Private
 * @returns
 */
/*module.exports.readDir = function readDir(path, cut,flat,remain) {
    var paths = fs.readdirSync(path);
    if(!exsists(cut)){
        cut = 0;
    }
    if(!exsists(flat)){
        flat = true;
    }
    if(!exsists(remain)){
        remain = "";
    }
    var out = paths.map(val => fs.statSync(join(path,val)).isDirectory() ? (flat ? [join(remain,val),...readDir(join(path,val),undefined,true,join(remain,val))] :[join(remain,val),readDir(join(path,val),undefined,false,join(remain,val))]): join(remain,val)).flat(1);
    return cut > 0 ? deleteFlat(out,cut).flat(Infinity) : out;
}*/
/**
 *
 * @param { string } path The path to read
 * @param { number } cut How deep to trim tree
 * @param { string } remain Private
 * @returns
 */
module.exports.readDir = function readDir(path, cut, remain) {
  var paths = fs.readdirSync(path);
  if (!exsists(cut)) {
    cut = 0;
  }
  if (!exsists(remain)) {
    remain = "";
  }
  var out = paths
    .map((val) =>
      fs.statSync(join(path, val)).isDirectory()
        ? cut > 0
          ? readDir(join(path, val), cut - 1)
          : readDir(join(path, val), 0, join(remain, val))
        : cut > 0
        ? undefined
        : join(remain, val)
    )
    .filter((v) => v)
    .flat(1);
  return out;
};
/**
 * Match all files in dir on glob
 * @param { string[] } globs The globs to match
 * @param { string } dir The dir to use
 * @param { number } cut How deep recursivly remove dirs
 * @param { boolean } not Inverse operation
 * @returns { string[] } The matcher
 */
module.exports.match = function (globs, dir, cut, not) {
  const matchers = picomatch(globs);
  return not
    ? this.readDir(dir, cut).filter((v) => !matchers(v))
    : this.readDir(dir, cut).filter(matchers);
};
//console.log(this.readDir("./temp",2), this.match(["**/from.js"], "./temp", 2, true));