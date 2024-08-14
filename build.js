// This MUST be built with the latest version of node
const yauzl = require("yauzl-promise"),
  axios = require("axios").default,
  {
    createWriteStream,
    readFileSync,
    writeFileSync,
    existsSync,
    mkdirSync,
    rmSync,
    renameSync,
    cpSync,
    readdirSync,
    statSync,
  } = require("fs"),
  stream = require("stream"),
  { join, relative, dirname, resolve } = require("path"),
  { promisify } = require("util"),
  finished = promisify(stream.finished),
  glob = require("./glob.js"),
  mkdirp = require("mkdirp").mkdirp,
  picomatch = require("picomatch"),
  pathGlobs = require("./files.json"),
  noopify = require("./noopify.js");

// Get token
const token =
  process.argv[process.argv.findIndex((v) => v == "--token" || v == "-T") + 1];
// Get url of latest nodejs version
axios({
  url: "https://api.github.com/repos/nodejs/node/releases",
  method: "get",
  headers: {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  },
})
  .then((res) => {
    writeFileSync("./version.txt", res.data[0].tag_name);
    return res.data[0].zipball_url;
  })
  .then((url) => {
    // Create TEMP
    mkdirSync("./temp");
    var zipStream = createWriteStream("./temp/nodejs.zip");
    var finishedPromise = axios({
      url: url,
      method: "GET",
      responseType: "stream",
    }).then((res) => {
      res.data.pipe(zipStream);
      return finished(zipStream);
    });
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
            await mkdirp(join("./temp", dirname(file.filename)));
            const inStream = await file.openReadStream(),
              outStream = createWriteStream(join("./temp", file.filename));
            await stream.promises.pipeline(inStream, outStream);
          }
        }
      }
      await reader.close();
      renameSync(
        readdirSync("./temp")
          .map((v) => join("./temp", v))
          .filter((v) => statSync(v).isDirectory)[0],
        "./temp/node-main"
      );
      // Create patches
      for (var path of glob.match(["**/!(*.old)"], "./patches")) {
        if (!existsSync(dirname(join("./temp/node-main/lib/internal", path)))) {
          await mkdirp(dirname(join("./temp/node-main/lib/internal", path)));
        }
        writeFileSync(
          join("./temp/node-main/lib/internal", path),
          readFileSync(join("./patches", path))
        );
      }
      /* writeFileSync("./temp/node-main/lib/internal/util.js",readFileSync("./utilPatch.js"));
  // Create patched validators
  writeFileSync("./temp/node-main/lib/internal/validators.js",readFileSync("./validators.js"));*/
      // Goto folder
      process.chdir(join("temp", "node-main", "lib"));
      console.log(process.cwd());
      console.log("Patching primordails");
      const patches = [
        "var primordials = {};",
        "module.exports = primordials;",
      ];
      writeFileSync(
        "./internal/per_context/primordials.js",
        [
          patches[0] +
            readFileSync("./internal/per_context/primordials.js") +
            patches[1],
        ].join("\n")
      );
      console.log("Createing fs noop");
      var fix = (v) => v.replace(/(?<="%.*)\\(?=.*%")|("%|%")|\\(?!\\)/gm, "");
      const JSONStringifySafe = (v) =>
        fix(
          JSON.stringify(v, (_key, value) =>
            typeof value === "function" ? "%" + value.toString() + "%" : value
          )
        );
      writeFileSync(
        "./fs.js",
        `module.exports = ${JSONStringifySafe(noopify(require("vm")))};`
      );
      mkdirSync("./fs");
      writeFileSync(
        "./fs/promises.js",
        'module.exports = require("../fs.js").promises'
      );
      console.log("Creating vm noop");
      writeFileSync(
        "./vm.js",
        `module.exports = ${JSONStringifySafe(noopify(require("vm")))};`
      );
      console.log("Writing meta");
      const metaData = {
        process: { release: process.release, version: process.version },
      };
      writeFileSync(
        "./internal/meta.js",
        `module.exports = ${JSONStringifySafe(metaData)};`
      );
      console.log(
        "Includeing primordials, process, and internalBinding in all files"
      );
      var files = glob.match(
        [
          "internal/bindings/**",
          "internal/patchSymbols.js",
          "internal/process.js",
          "internal/per_context/primordials.js",
          "internal/meta.js",
        ],
        "../../../temp",
        2,
        true
      );
      const getLoc = (absolutePath, filePath) =>
        (filePath.includes("/")
          ? relative(dirname(filePath), absolutePath)
          : `./${absolutePath}`
        ).replace(/(?<!\.\/)(?<![A-z\/\.])(?=[A-z])/, "./");
      const makeRequire = (
        fromFilePath,
        pathOfFileToRequire,
        whatToNameTheVarable
      ) =>
        resolve(pathOfFileToRequire) === resolve(fromFilePath)
          ? ""
          : `var ${whatToNameTheVarable} = require("${getLoc(
              pathOfFileToRequire,
              fromFilePath
            )}");\n`;
      for (const filePath of files) {
        var primordialsRequireStatment = makeRequire(
          filePath,
          "internal/per_context/primordials.js",
          "primordials"
        );
        var internalBindingRequireStatment = makeRequire(
          filePath,
          "internal/internalBinding.js",
          "internalBinding"
        );
        var processRequireStatment =
          resolve(filePath) === resolve("internal/internalBinding.js")
            ? ""
            : makeRequire(filePath, "internal/process.js", "process");
        writeFileSync(
          filePath,
          `//Patch\n//BOCK\n${primordialsRequireStatment}${internalBindingRequireStatment}${processRequireStatment}` +
            readFileSync(filePath)
              .toString()
              .replace(
                /(?<=require\(")internal\/[^"]*(?="\))|(?<=require\(')internal\/[^']*(?='\))/g,
                (match) => {
                  var out = filePath.includes("/")
                    ? relative(dirname(filePath), match)
                    : match;
                  out =
                    out == ""
                      ? relative(dirname(filePath), match + ".js")
                      : out;
                  return out.replace(
                    /(?<!\.\/)(?<![A-z\/\.\-])(?=[A-z])/,
                    "./"
                  );
                }
              )
              .replace(
                /(?<=require\('|")(timers|events|fs|(fs\/.+)|vm|stream|(stream\/.+))(?='|"\))/gm,
                (match) =>
                  match === "events"
                    ? getLoc("events.js", filePath)
                    : match === "timers"
                    ? getLoc("internal/timers.js", filePath)
                    : match === "stream"
                    ? getLoc("stream.js", filePath)
                    : match === "fs"
                    ? getLoc("fs.js", filePath)
                    : match === "vm"
                    ? getLoc("vm.js", filePath)
                    : getLoc(match, filePath)
              )
        );
      }
      console.log(files);
      const bundlePath = "../../../bundle";
      mkdirp(bundlePath);
      cpSync("./", bundlePath, { recursive: true });
      process.chdir(dirname(bundlePath));
      rmSync("./temp", { recursive: true });
    });
  });
