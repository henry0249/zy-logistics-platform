'use strict';

const Controller = require('egg').Controller;

class GoodsController extends Controller {
  async cascader() {
    this.ctx.body = await this.ctx.service.goods.cascader();
  }
}
module.exports = GoodsController;