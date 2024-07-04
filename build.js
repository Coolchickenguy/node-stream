const yauzl = require("yauzl-promise"),
  axios = require("axios").default,
  {
    createWriteStream,
    readFileSync,
    writeFileSync,
    existsSync,
    mkdirSync,
    rmSync,
    cpSync,
  } = require("fs"),
  stream = require("stream"),
  { join, relative,dirname } = require("path"),
  { promisify } = require("util"),
  finished = promisify(stream.finished),
  glob = require("./glob.js"),
  mkdirp = require("mkdirp").mkdirp,
  picomatch = require("picomatch"),
  pathGlobs = require("./files.json");

// Create TEMP
mkdirSync("./temp");
var zipStream = createWriteStream("./temp/nodejs.zip");
var finishedPromise = axios({
  url: "https://codeload.github.com/nodejs/node/zip/refs/heads/main",
  method: "GET",
  responseType: "stream",
}).then(res => {res.data.pipe(zipStream); return finished(zipStream);});
finishedPromise.then(async () => {
  // File created
  const reader = await yauzl.open("./temp/nodejs.zip"),
    matcher = picomatch(pathGlobs);
  // Extract from nodejs source code
  for await (const file of reader) {
    if (matcher(file.filename)) {
      if (file.filename.endsWith("/")) {
        await mkdirp(join("./temp", file.filename));
      } else {
        await mkdirp(join("./temp",dirname(file.filename)));
        const inStream = await file.openReadStream(),
          outStream = createWriteStream(join("./temp", file.filename));
        await stream.promises.pipeline(inStream, outStream);
      }
    }
  }
  // Create patches
  for(var path of glob.readDir("./patches")){
    if(!existsSync(dirname(join("./temp/node-main/lib/internal",path)))){
        await mkdirp(dirname(join("./temp/node-main/lib/internal",path)));
    }
    writeFileSync(join("./temp/node-main/lib/internal",path),readFileSync(join("./patches",path)));
  }
 /* writeFileSync("./temp/node-main/lib/internal/util.js",readFileSync("./utilPatch.js"));
  // Create patched validators
  writeFileSync("./temp/node-main/lib/internal/validators.js",readFileSync("./validators.js"));*/
  // Goto folder
  process.chdir(join("temp","node-main","lib"));
  console.log(process.cwd());
  console.log("Patching primordails");
  const patches = ["var primordials = {};","globalThis.internalBinding = require(\"../internalBinding.js\"); module.exports = primordials;"];
  writeFileSync("./internal/per_context/primordials.js",[patches[0] + readFileSync("./internal/per_context/primordials.js") + patches[1]].join("\n"));
  console.log("Includeing primordials in all files and prossess")
  var files = glob.match(["{*.!(*js),internal/per_context/primordials.js,internal/process.js,internal/internalBinding.js,internal/bindings/**,internal/patchSymbols.js}"], "../../../temp", 2,true);
  const getLoc = (absolutePath,filePath) => ((filePath.includes("/") ? relative(dirname(filePath),absolutePath) : `./${absolutePath}`)).replace(/(?<!\.\/)(?<![A-z\/\.])(?=[A-z])/,"./");
  for (const filePath of files) {
    var primordailsLocation = getLoc("internal/per_context/primordials.js",filePath);
    var processLocation = getLoc("internal/process.js",filePath);
   console.log(`On path ${filePath}, primordials is at ${primordailsLocation} and process is at ${processLocation}`);
   writeFileSync(filePath,`//Patch\n//BOCK\nvar primordials = require("${primordailsLocation}");var process = require("${processLocation}");` + readFileSync(filePath).toString().replace(/(?<=require\(")internal\/[^"]*(?="\))|(?<=require\(')internal\/[^']*(?='\))/g,(match) => {var out = (filePath.includes("/") ? relative(dirname(filePath),match) : match);out = out == "" ? relative(dirname(filePath),match + ".js") : out;return out.replace(/(?<!\.\/)(?<![A-z\/\.])(?=[A-z])/,"./")}).replace(/(?<=require\('|")events|stream\/.*(?='|"\))/gm,(match) => match == "events" ? getLoc("events.js",filePath) : getLoc(join("temp",match),filePath)));
  }
  console.log(files);
  const bundlePath = "../../../bundle";
  mkdirp(bundlePath);
  cpSync("./", bundlePath, {recursive: true});
  process.chdir(dirname(bundlePath));
  rmSync("./temp",{recursive:true});
});
