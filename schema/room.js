return {
  /**
   * Child schema
   */
  editor: require('./editor'),
  /**
   * Configuration
   */
  id: 'room',
  title: 'Room',
  type: 'object',
  properties: {
    name:{
      type: 'string',
      minLength: 1,
      maxLength: 25
    },
    reload: {
      type: 'boolean'
    },
    main: {
      type: 'string'
    },
    editors: {
      type: 'array',
      maxItems: 10,
      items: { '$ref': 'editor' }
    }
  }
};