const Service = require('egg').Service;
const roleField = require('../field/Role');

class RoleService extends Service {
  async multi() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!(body && body instanceof Array && body.length > 0)) {
      ctx.throw(422, '批量操作失败,未接收到操作数据', body);
    }
    for (let i = 0; i < body.length; i++) {
      const item = body[i];
      await this.set(item);
    }
    return 'ok';
  }
  async set(data) {
    const ctx = this.ctx;
    let body = data || ctx.request.body;
    if (!body.user) {
      ctx.throw(422, '用户信息必填', body);
    }
    if (!body.company) {
      ctx.throw(422, '当前公司信息必填', body);
    }
    if (!body.type) {
      ctx.throw(422, '角色类型必填', body);
    }
    if (!roleField.type.option[body.type]) {
      ctx.throw(422, '角色类型不合法', body);
    }
    if (body._id) {
      let update = JSON.parse(JSON.stringify(body));
      delete update._id;
      delete update.createdAt;
      delete update.updatedAt;
      await ctx.model.Role.update({
        _id: body._id
      }, update)
    } else {
      let roleModel = new ctx.model.Role(body);
      await roleModel.save();
    }
    return 'ok';
  }
  async add() {
    return await this.set();
  }
}
module.exports = RoleService;