'use strict';

const Controller = require('egg').Controller;

class TransferController extends Controller {
  async cascader() {
    this.ctx.body = await this.ctx.service.transfer.cascader();
  }
}
module.exports = TransferController;