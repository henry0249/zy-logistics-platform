const Service = require('egg').Service;

class SettleService extends Service {
  async getBusinessTrainsTab() {
    const ctx = this.ctx;
    let req = ctx.request.body;
    if (!req.company) ctx.throw(422, '公司信息获取失败');
    let businessTrainsData = await ctx.model.BusinessTrains.find({
      receivedCompany: req.company
    }).populate([{
      path: 'company'
    }, {
      path: 'user'
    }]);
    let res = [];
    businessTrainsData.forEach(item => {
      let resItem = {};
      if (item.company && item.company._id) {
        resItem._id = item.company._id;
        resItem.name = item.company.name || item.company.nick || item.company.code || item.company.mobile;
      }
      if (item.user && item.user._id) {
        resItem.isUser = true;
        resItem._id = item.user._id;
        resItem.name = item.user.name || item.user.nick || item.user.mobile;
      }
      if (resItem._id) res.push(resItem);
    });
    return ctx.helper.unique(res, '_id');
  }
}

module.exports = SettleService;