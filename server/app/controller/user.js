'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async info() {
    const {
      ctx
    } = this;
    ctx.body = ctx.user;
  }
  async loginLocal(){
    const {
      ctx
    } = this;
    ctx.body = await ctx.service.user.loginLocal(ctx.request.body)
  }
  async registerMobile() {
    const {
      ctx
    } = this;
    ctx.body = await ctx.service.user.registerMobile(ctx.request.body)
  }
  async logout() {
    const {
      ctx
    } = this;
    ctx.body = await ctx.service.user.logout()
  }
  async refleshToken(){
    const {
      ctx
    } = this;
    ctx.body = await ctx.service.jwt.reflesh()
  }
  async power(){
    const {
      ctx
    } = this;
    ctx.body = await ctx.service.user.power()
  }
}

module.exports = UserController;