function Module(id, fn) {
  this.id = id;
  this.fn = fn;
  this.exports = null;
  this._loader = null;
}

Module.prototype.get = function () {
  if (this.exports === null) {
    this.fn(this, this._loader.require.bind(this._loader));
  }
  return this.exports;
};

function Loader() {
  this.modules = {};
}

Loader.prototype.require = function (id) {
  return this.modules[id] && this.modules[id].get();
};

Loader.prototype.define = function (id, fn) {
  var module = new Module(id, fn);
  this.register(module);
  return module;
};

Loader.prototype.register = function (module) {
  module._loader = this;
  this.modules[module.id] = module;
};

module.exports = Loader;