'use strict';

const Controller = require('egg').Controller;

class BadgeController extends Controller {
  async getHeaderBadge() {
    this.ctx.body = await this.ctx.service.badge.getHeaderBadge();
  }
  async getSubHeaderBadge() {
    this.ctx.body = await this.ctx.service.badge.getSubHeaderBadge();
  }
}
module.exports = BadgeController;