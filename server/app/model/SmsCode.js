module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('zylp');

  const SmsCodeSchema = new Schema({
    value: String, //code值
    mobile: String, //手机号
    createdAt: Date
  }, {
    versionKey: false,
    timestamps: true
  });

  return conn.model('SmsCode', SmsCodeSchema);
}