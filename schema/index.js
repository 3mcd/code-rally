module.exports = {
  /**
   * Child schema
   */
  schemas: {
    rooms: require('./room'),
    editors: require('./editor')
  },
  validators: {
    join: {
      async: function(context, done) {
        var id = context.value; // here is value for this op
        if (!id) return done();
        var collection = context.schema.collection; // context.schema - is schema of current property
        var model = this.store.createModel();
        var $entity = model.at(collection + '.' + id);
        model.fetch($entity, function(err) {
          if (err) return done(err);
          if (!$entity.get()) {
            return done(Error('No ' + collection + ' with id ' + id));
          }
          done();
        });
      }
    }
  }
};