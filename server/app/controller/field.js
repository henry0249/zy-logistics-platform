'use strict';

const Controller = require('egg').Controller;

class FieldController extends Controller {
  async index() {
    const ctx = this.ctx;
    ctx.body = require('../field')('ALL');
  }
}

module.exports = FieldController;
