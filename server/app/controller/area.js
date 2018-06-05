'use strict';

const Controller = require('egg').Controller;
const areaField = require('../field/Area');

class AreaController extends Controller {
  async add() {
    this.ctx.body = await this.ctx.service.area.add();
  }
  async cascader() {
    const ctx = this.ctx;
    let res = {};
    for (const key in areaField.type.option) {
      res[key] = await ctx.model.Area.find({
        type: key
      }).select('key name').sort({
        createdAt: 1
      });
    }
    ctx.body = res;
  }
}
module.exports = AreaController;