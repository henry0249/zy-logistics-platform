'use strict';

const Controller = require('egg').Controller;
const areaField = require('../field/Area');

class AreaController extends Controller {
  async add() {
    this.ctx.body = await this.ctx.service.area.add();
  }
  async cascader() {
    const ctx = this.ctx;
    this.ctx.body = await this.ctx.service.area.cascader();
    
  }
}
module.exports = AreaController;