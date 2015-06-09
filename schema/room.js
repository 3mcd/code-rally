module.exports = {
  /**
   * Child schema
   */
  /**
   * Configuration
   */
  id: 'room',
  title: 'Room',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 25
    },
    reload: {
      type: 'boolean'
    },
    main: {
      oneOf: [
        { $ref: require('./editor') },
        { type: 'null' }
      ]
    }
  }
};