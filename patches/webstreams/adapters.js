module.exports = new Proxy(
  {},
  {
    get() {
        console.error(new Error("Webstreams are not supported"));
        return module.exports;
    },
    set() {
      return true;
    },
  }
);
