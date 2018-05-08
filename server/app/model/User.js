module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('zylp');

  const UserSchema = new Schema({
    type: String, //散户 大客户 vip
    mobile: String,
    email: String,
    name: String,
    info: Object,
    password: String,
    company:[{
      type: Schema.Types.ObjectId,
      ref: 'Company'
    }],
    role: {
      type: Array,
      default: [{
        name: '普通用户',
        value: 'common'
      }]
    }
  }, {
    versionKey: false,
    timestamps: true
  });

  return conn.model('User', UserSchema);
}