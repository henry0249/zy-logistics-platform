const Service = require('egg').Service;

class CheckService extends Service {
  async sys(param, msg = '需要系统管理员权限') {
    const ctx = this.ctx;
    let flag = ctx.user.isSys;
    if (!flag) {
      ctx.throw(401, msg, param);
    }
    return flag;
  }
}
module.exports = CheckService;