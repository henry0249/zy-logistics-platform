'use strict';

const fs = require('fs');
const path = require('path');
const send = require('koa-send');
const Controller = require('egg').Controller;

class StaticController extends Controller {
  async index() {
    const {
      ctx
    } = this
    let root = path.resolve(__dirname, '../view');
    let filePath = this.ctx.helper.staticFilter(ctx.path);
    await send(ctx, filePath, {
      root: root
    });
  }
  async views() {
    const {
      ctx
    } = this
    let root = path.resolve(__dirname, '../../views/dist');
    let realpath = ctx.path;
    
    if (realpath === '/') {
      ctx.redirect('/views/login.html')
    }
    if (realpath.indexOf('.html') > -1) {
      realpath = 'index.html';
    }
    let filePath = ctx.helper.staticFilter(realpath);
    await send(ctx, filePath, {
      root: root
    });
  }
  async zylp() {
    const {
      ctx
    } = this
    let root = path.resolve(__dirname, '../../../zy-logistics-platform/cms/dist');
    let filePath = ctx.helper.staticFilter(ctx.path);
    await send(ctx, filePath, {
      root: root
    });
  }
}
module.exports = StaticController