'use strict';

const Controller = require('egg').Controller;

class LibController extends Controller {
  async smsSend() {
    const ctx = this.ctx
    ctx.body = await ctx.service.sms.send(ctx.request.body)
  }
  async smsValidate() {
    const ctx = this.ctx
    ctx.body = await ctx.service.sms.validate(ctx.request.body)
  }
  async yixiuSmsSend() {
    const ctx = this.ctx
    ctx.body = await ctx.service.yixiuSms.send(ctx.request.body)
  }
  async yixiuSmsValidate() {
    const ctx = this.ctx
    ctx.body = await ctx.service.yixiuSms.validate(ctx.request.body)
  }
  async geocoder(){
    const ctx = this.ctx;
    ctx.body = await ctx.service.baiduMap.geocoder();
  }
}

module.exports = LibController;
