'use strict';

const Controller = require('egg').Controller;

class PlatformController extends Controller {
  async orgTree() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.platform.orgTree();
  }
}

module.exports = PlatformController;
