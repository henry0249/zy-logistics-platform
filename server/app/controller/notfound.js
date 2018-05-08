'use strict';

const Controller = require('egg').Controller;

class NotfoundController extends Controller {
  async index() {
    let msg = '接口地址未找到'
    if (this.ctx.method === 'GET') {
      msg = '页面未找到'
    }
    this.ctx.throw(404, msg, {
      method:this.ctx.method
    });
  }
}

module.exports = NotfoundController;
