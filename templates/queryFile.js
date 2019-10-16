module.exports = function createQueryContent(routeName) {
  const queryContent = 
`const database = require('../database-connection');

module.exports = {
  list() {
    return database('${routeName}').select();
  },
  read(id) {
    return database('${routeName}').select().where('id', id).first();
  },
  create(id) {
    return database('${routeName}')
      .insert()
      .where('id', id)
      .returning('*')
      .then(record => record[0]);
  },
  update(id) {
    return database('${routeName}')
      .update()
      .where('id', id)
      .returning('*')
      .then(record => record[0]);
  },
  delete(id) {
    return database('${routeName}').delete().where('id', id);
  }
};
`
  return queryContent
}