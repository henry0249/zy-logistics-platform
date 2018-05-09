module.exports = (app, filename) => {
  const conn = app.mongooseDB.get('zylp');
  if (filename) {
    let modelName = filename.replace(__dirname + '/', '').replace('.js', '');
    let model = require('../field')(modelName);
    return conn.model(model.name, model.schema);
  }
}