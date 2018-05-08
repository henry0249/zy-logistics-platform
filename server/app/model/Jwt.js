module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('zylp');

  const JwtSchema = new Schema({
    value: String,
    info: Array,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    expAt: Date,
    loginAt: Date,
    logoutAt: Date
  }, {
    versionKey: false,
    timestamps: true
  });

  return conn.model('Jwt', JwtSchema);
}