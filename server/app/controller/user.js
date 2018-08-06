'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async info() {
    const ctx = this.ctx;
    ctx.body = ctx.user;
  }
  async loginInfo() {
    const ctx = this.ctx;
    ctx.body = ctx.tokenData;
  }
  async loginLocal() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.user.loginLocal(ctx.request.body)
  }
  async loginSys() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.user.loginSys(ctx.request.body)
  }
  async registerMobile() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.user.registerMobile(ctx.request.body)
  }
  async logout() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.user.logout()
  }
  async refleshToken() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.jwt.reflesh()
  }
}

module.exports = UserController;