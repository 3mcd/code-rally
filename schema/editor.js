module.exports = {
  id: 'editor',
  title: 'Editor',
  properties: {
    roomId: {
      type: 'string',
      collection: 'rooms',
      validators: ['join']
    },
    name: {
      type: 'string'
    },
    mode: {
      type: 'string'
    },
    text: {
      type: 'string'
    }
  }
};