const Service = require('egg').Service;
const roleField = require('../field/Role');


class CheckService extends Service {
  async sys(param, msg = '需要系统管理员权限') {
    const ctx = this.ctx;
    if (!ctx.user.isSys) {
      ctx.throw(401, msg, param);
    }
    return true;
  }
  async role(
    type,
    company,
    msg = '无权限操作',
  ) {
    const ctx = this.ctx;
    if (type instanceof Array) {
      if (type.length === 0) {
        ctx.throw(401, msg);
      }
      type.forEach((item) => {
        if (!roleField.type.option[item]) {
          ctx.throw(401, msg);
        }
      });
    } else {
      if (!roleField.type.option[type]) {
        ctx.throw(401, msg);
      }
    }
    if (!company) {
      ctx.throw(401, '无权限操作,未指定当前操作公司');
    }
    let findOption = {
      company: company,
      user: ctx.user._id
    }
    if (type instanceof Array) {
      findOption.type = {
        $in: type
      };
    } else {
      findOption.type = type;
    }
    let role = await ctx.model.Role.findOne(findOption);
    if (!role) {
      ctx.throw(401, `您无权限操作,需要${roleField.type.option[type]}权限`);
    }
    return true;
  }
}
module.exports = CheckService;