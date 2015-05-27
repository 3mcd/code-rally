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
        if (this.isCheckbox) {
          model.set(expression, this.el.value == 'on');
        } else if (this.isTextInput) {
          if ('number' == typeof previous) {
            intOp(model, expression, parseInt(this.el.value));
          } else {
            stringOp(model, expression, this.el.value, previous);
          }
        } else {
          model.set(expression, this.el.value);
        }
      }.bind(this);

      this.isCheckbox = this.el.getAttribute('type') == 'checkbox';

      this.isTextInput = this.el.nodeType === 3 ||
        this.el.tagName == 'TEXTAREA' ||
        this.el.tagName == 'INPUT' && !this.isCheckbox;

      if (this.isTextInput) {
        this.el.addEventListener('input', this.handler);
      } else {
        this.el.addEventListener('change', this.handler);
      }
    }
  },

  unbind: function () {
    this.el.removeEventListener('input', this.handler);
    this.el.addEventListener('change', this.handler);
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