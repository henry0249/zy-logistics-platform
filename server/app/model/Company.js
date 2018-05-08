module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('zylp');

  const CompanySchema = new Schema({
    isPlatform: Boolean, //是否为平台的标识
    name: String, //公司名称
    auth: Boolean, //是否通过资质认证
    qualification: Object, //资质认证对象
    info: Object, //备用信息
    data: Array, //备用数据
    platform: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    }, //所属平台标识
    admin: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }], //管理员
    salesman: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }], //业务员
    auditor: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }], // 审核员
    dispatcher: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }], //调度员
    financial: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }] //财务人员
  }, {
    versionKey: false,
    timestamps: true
  });

  return conn.model('Company', CompanySchema);
}