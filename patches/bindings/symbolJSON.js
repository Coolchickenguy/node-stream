module.exports = object => JSON.stringify(object,(_key,value) => typeof value == "symbol"? value.toString().replace(/(?<=Symbol\()(?<!Symbol\(.+)|(?=\))(?!.+\))/g,'"') : value).replace(/"(?=Symbol\()|(?<="\))"|\\(?=")/gm,"");