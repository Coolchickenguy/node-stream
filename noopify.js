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
module.exports = function (obj) {
  return mapObjectValues(obj, (v) => (typeof v === "function" ? () => {} : v));
};
