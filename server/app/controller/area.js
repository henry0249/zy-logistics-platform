'use strict';

const Controller = require('egg').Controller;

class AreaController extends Controller {
  async add() {
    this.ctx.body = await this.ctx.service.area.add();
  }
}
module.exports = AreaController;