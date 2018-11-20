const Service = require('egg').Service;
const badgeRole = {
  order: ['salesman', 'salesmanManager', 'tradeClerk'],
  dispatch: ['dispatcher', 'dispatcherManager', 'logisticsClerk'],
  logistics: ['dispatcher', 'dispatcherManager', 'logisticsClerk'],
  settle: ['documentClerk', 'documentClerkManager', 'financial', 'settle', 'financialManager'],
  stock: ['stockClerk', 'stockAdmin'],
};

class BadgeService extends Service {
  async getHeaderBadge() {
    const ctx = this.ctx;
    let res = {};
    let role = await ctx.model.Role.find({
      user: ctx.user._id
    });
    if (role.length === 0) return res;
    let companySet = new Set();
    let roleTypeSet = new Set();

    for (const key in badgeRole) {
      let item = badgeRole[key];
      res[key] = 0;
      role.map((roleItem) => {
        if (roleItem.company && item.includes(roleItem.type)) {
          companySet.add(roleItem.company.toString());
          roleTypeSet.add(roleItem.type);
        }
      });
      if (roleTypeSet.size === 0) continue;
      if (companySet.size === 0) continue;
      if (key === 'order' || key === 'dispatch') {
        let hasOrder = await ctx.model.Order.findOne({
          state: {
            $in: item
          },
          handle: {
            $in: [...companySet]
          }
        });
        if (hasOrder) res[key] = 1;
      }
    }
    return res;
  }
  async getSubHeaderBadge() {
    const ctx = this.ctx;
    const req = ctx.request.body;
    const type = req.type;
    if (!type) ctx.throw(422, '标记类型错误');
    if (!badgeRole[type]) ctx.throw(422, '标记类型错误');
    let res = {};
    let role = await ctx.model.Role.find({
      user: ctx.user._id
    });
    if (role.length === 0) return res;
    let companySet = new Set();
    let roleTypeSet = new Set();
    if (type === 'order' || type === 'dispatch') {
      let badgeRoleItem = badgeRole[type];
      for (let i = 0; i < badgeRoleItem.length; i++) {
        const item = badgeRoleItem[i];
        role.map((roleItem) => {
          if (roleItem.company && item.includes(roleItem.type)) {
            companySet.add(roleItem.company.toString());
            roleTypeSet.add(roleItem.type);
          }
        });
        res[item] = await ctx.model.Order.count({
          state: item,
          handle: {
            $in: [...companySet]
          }
        });
      }
    }
    return res;
  }
}
module.exports = BadgeService;