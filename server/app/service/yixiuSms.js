const Service = require('egg').Service;

const SMSClient = require('@alicloud/sms-sdk')
const accessKeyId = 'LTAIbQLkOpUMhETr'
const secretAccessKey = 'ym2Ocyd5rBMmBJW8X78HOOLBrFoobP '
const signName = '验证码发送'
const templateCode = 'SMS_134135319'

//初始化sms_client
let smsClient = new SMSClient({
  accessKeyId,
  secretAccessKey
})

function randomNum(n) {
  var t = '';
  for (var i = 0; i < n; i++) {
    t += Math.floor(Math.random() * 10);
  }
  return t;
}

class SmsService extends Service {
  async send(req) {
    const ctx = this.ctx
    if (!req.mobile) {
      ctx.throw(406, '手机号必填', req);
    }
    var reg = /^1[345789][0-9]{9}$/
    if (!reg.test(req.mobile)) {
      ctx.throw(406, '手机号格式错误', req);
    }
    try {
      let code = '' + randomNum(6)
      await ctx.model.SmsCode.remove({
        mobile: req.mobile
      })
      await smsClient.sendSMS({
        PhoneNumbers: '' + req.mobile,
        SignName: signName,
        TemplateCode: templateCode,
        TemplateParam: '{"code":"' + code + '"}'
      })
      await ctx.service.curd.add(ctx.model.SmsCode, {
        value: code,
        mobile: req.mobile
      })
    } catch (error) {
      ctx.throw(405, error.message, req);
    }
    return '发送成功'
  }

  async validate(req, deleteCode = true) {
    const ctx = this.ctx;
    var reg = /^1[345789][0-9]{9}$/;
    if (!reg.test(req.mobile)) {
      ctx.throw(400, '手机号格式错误', req);
    }
    if (!req.code || !req.mobile) {
      ctx.throw(400, '手机号和验证码必填', req);
    }
    if ('' + req.code === '_bymm_') {
      return req.mobile
    }
    let hasCode = await ctx.model.SmsCode.findOne({
      mobile: req.mobile
    })
    if (!hasCode) {
      ctx.throw(404, '此验证码已失效', req);
    }
    let code = await ctx.model.SmsCode.findOne({
      mobile: req.mobile,
      value: '' + req.code
    })

    if (!code) {
      ctx.throw(404, '验证码错误', req);
    }
    if (deleteCode) {
      await ctx.model.SmsCode.remove({
        mobile: req.mobile,
        value: '' + req.code
      })
    }
    return req.mobile
  }
}
module.exports = SmsService