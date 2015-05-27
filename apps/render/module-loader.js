var createModule = function (id, fn) {
  var _loader = null;
  var _fn = fn;

  function Module(id) {
    this.id = id;
    this.exports = null;
  }

  Module.prototype.get = function () {
    if (this.exports === null) {
      _fn(this, _loader.require.bind(_loader));
    }
    return this.exports;
  };

  Module.prototype.setLoader = function (loader) {
    _loader = loader;
  };

  return new Module(id);
};

function Loader() {
  this.modules = {};
}

Loader.prototype.require = function (id) {
  return this.modules[id] && this.modules[id].get();
};

Loader.prototype.define = function (id, fn) {
  var mod = createModule(id, fn);
  this.register(mod);
  return mod;
};

Loader.prototype.register = function (mod) {
  mod.setLoader(this);
  this.modules[mod.id] = mod;
};

module.exports = Loader;