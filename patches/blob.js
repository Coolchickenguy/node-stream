var { isPromise, isFunction } = internalBinding("types");
// Libraries sometimes bundle their own blob implementation for backwards compatibility, so this is a more usefull check than "object instanceof Blob"
function isBlob(object = {}) {
  // Checks if all propertys exsist and are of the correct type
  return (
    isPromise(object.arrayBuffer) &&
    !isNaN(object.size) &&
    isFunction(object.slice) &&
    isFunction(object.stream) &&
    isPromise(object.text) &&
    typeof object.type === "string"
  );
}
module.exports = {
  Blob,
  isBlob,
};
