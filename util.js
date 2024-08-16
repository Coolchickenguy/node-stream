function mapObjectValues(value, callback) {
  value = Object.assign({}, value);
  Object.keys(value).forEach((key) => {
    if (typeof value[key] === "object") {
      value[key] = mapObjectValues(value[key], callback);
    } else {
      value[key] = callback(value[key]);
    }
  });
  return value;
}
function filterObjectValues(value, callback) {
  value = Object.assign({}, value);
  Object.keys(value).forEach((key) => {
    if (typeof value[key] === "object") {
      value[key] = filterObjectValues(value[key], callback);
    } else {
      if (!callback(value[key])) {
        delete value[key];
      }
    }
  });
  return value;
}
function noopify(obj) {
  return mapObjectValues(obj, (v) => (typeof v === "function" ? () => {} : v));
}
module.exports = { mapObjectValues, filterObjectValues, noopify };
