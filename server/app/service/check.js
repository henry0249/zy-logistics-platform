const Service = require('egg').Service;

class CheckService extends Service {
  async sys(param, msg = '需要系统管理员权限') {
    const ctx = this.ctx;
    if (!ctx.user.isSys) {
      ctx.throw(401, msg, param);
    }
    return true;
  }
  async platformAdmin(param, msg = '需要平台管理员或系统管理员权限') {
    const ctx = this.ctx;
    if (!ctx.user.isSys) {
      let isPlatformAdmin = ctx.service.curd.findOne(ctx.model.Platform, {
        admin: { in: [ctx.user._id]
        }
      });
      if (!isPlatformAdmin) {
        ctx.throw(404, msg, param);
      }
    }
    return true;
  }
  async companyAdmin(param, msg = '需要公司管理员或系统管理员权限') {
    const ctx = this.ctx;
    if (!ctx.user.isSys) {
      let isCompanyAdmin = ctx.service.curd.findOne(ctx.model.Company, {
        admin: { in: [ctx.user._id]
        }
      });
      if (!isCompanyAdmin) {
        ctx.throw(404, msg, param);
      }
    }
    return true;
  }
}
module.exports = CheckService;