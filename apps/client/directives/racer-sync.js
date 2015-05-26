module.exports = {
  
  isLiteral: true,

  bind: function () {
    var expression = this.expression;
    var modelRef = this.arg || '$model';
    var model = modelRef.split('.').reduce(function (a, x) {
      return a && a[x];
    }, this.vm.$data);

    if (model) {
      this.handler = function () {
        var previous = model.get(expression);
        if ('number' == typeof previous) {
          intOp(model, expression, parseInt(this.el.value));
        } else {
          stringOp(model, expression, this.el.value, previous);
        }
      }.bind(this);

      this.attr =
        this.el.nodeType === 3 ||
        this.el.tagName == 'TEXTAREA' ||
        this.el.tagName == 'INPUT' ? 'value' : 'textContent';

      this.el.addEventListener('input', this.handler);
    }
  },

  unbind: function () {
    this.el.removeEventListener('input', this.handler);
  }

};

function intOp(model, path, value) {
  model.set(path, value);
}

function stringOp(model, path, value, previous) {
  var start = 0,
      end = 0;

  previous = previous || '';

  if (previous === value) return;

  while (previous && (previous.charAt(start) == value.charAt(start))) {
    start++;
  }

  while (
    previous.charAt(previous.length - 1 - end) === value.charAt(value.length - 1 - end) &&
    end + start < previous.length &&
    end + start < value.length
  ) {
    end++;
  }

  if (previous.length !== start + end) {
    var howMany = previous.length - start - end;
    model.stringRemove(path, start, howMany);
  }
  if (value.length !== start + end) {
    var inserted = value.slice(start, value.length - end);
    model.stringInsert(path, start, inserted);
  }
}