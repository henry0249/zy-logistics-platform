'use strict';

const Controller = require('egg').Controller;

class CurdController extends Controller {
  async index() {
    this.ctx.body = await this.ctx.service.curd.index();
  }
}
module.exports = CurdController;