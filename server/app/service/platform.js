const Service = require('egg').Service;

class PlatformService extends Service {
  async beforeCurd(curdType, param) {
    const ctx = this.ctx;
    const check = ctx.service.check;
    if (curdType === 'add' || curdType === 'set') {
      await check.platformAdmin(param);
    }
  }
  async add(param) {
    const ctx = this.ctx;
    let admin = [];
    let sys = await ctx.service.curd.find(ctx.model.User, {
      isSys: true,
    });
    if (sys.length === 0) {
      ctx.throw(400, '未指定系统管理员', param);
    }
    sys.forEach(item => {
      admin.push(item._id)
    });
    return {
      ...param,
      creater: ctx.user._id,
      owner: ctx.user._id,
      admin
    };
  }
  async set(param) {
    return await this.add(param);
  }
  async curdCallback(param) {
    const ctx = this.ctx;
    if (param.curdType === 'set' || param.curdType === 'add') {
      let user = await ctx.service.curd.find(ctx.model.User, {
        _id: {
          $in: [
            ...param.data.admin,
            ...param.data.salesman,
            ...param.data.auditor,
            ...param.data.dispatcher,
            ...param.data.documentClerk,
            ...param.data.financial
          ]
        },
      });
      for (let i = 0; i < user.length; i++) {
        await user[i].update({
          $addToSet: {
            platform: param.data._id
          }
        });
      }
    }
    return param.data;
  }
  async orgTree() {
    const ctx = this.ctx;
    let req = ctx.request.body;
    if (!req._id) {
      ctx.throw(422, '平台_id必填', req);
    }
    let companyUser = [{
      name: '管理员',
      path: 'admin'
    }, {
      name: '业务专员',
      path: 'salesman'
    }, {
      name: '财务文员',
      path: 'financial'
    }];
    let platformCompany = [{
      name: '物流公司',
      path: 'logistics'
    }, {
      name: '发货厂商',
      path: 'shipper'
    }, {
      name: '贸易公司',
      path: 'trading'
    }];
    let platformUser = [{
      name: '管理员',
      path: 'admin'
    }, {
      name: '市场专员',
      path: 'salesman'
    }, {
      name: '审核员',
      path: 'auditor'
    }, {
      name: '物流专员',
      path: 'dispatcher'
    }, {
      name: '单据文员',
      path: 'documentClerk'
    }, {
      name: '财务专员',
      path: 'financial'
    }];
    let platform = await ctx.model.Platform.findById(req._id).populate([
      ...platformUser
    ]);
    if (!platform) {
      ctx.throw(422, '未找到平台数据', req);
    }
    let data = {
      name: platform.name,
      children: [],
      root: true
    };
    for (let i = 0; i < platformCompany.length; i++) {
      let childrenItem = platformCompany[i];
      let pushItem = {
        name: childrenItem.name,
        children: [],
        company: true,
        type: childrenItem.path
      };
      let platformCompanyData = await ctx.model.Company.find({
        type: {
          $in: [childrenItem.path]
        },
        platform:platform._id
      });
      platformCompanyData.forEach((companyItem) => {
        let companyPushItem = {
          _id: companyItem._id,
          name: companyItem.name + (companyItem.self?'(自营)':''),
          self: companyItem.self,
          companyNode: true,
          children: []
        };
        companyUser.forEach((userItem) => {
          let companyUserPushItem = {
            name: userItem.name,
            companyUser: true,
            company_id: companyItem._id,
          };
          companyPushItem.children.push(companyUserPushItem);
        });
        pushItem.children.push(companyPushItem);
      })
      data.children.push(pushItem);
    }
    platformUser.forEach((childrenItem) => {
      let pushItem = {
        name: childrenItem.name,
        children: [],
        user: true,
        type: childrenItem.path
      };
      platform[childrenItem.path].forEach((userItem) => {
        let userName = userItem.name || userItem.mobile;
        if (userItem.isSys) {
          userName += '(系统管理员)';
        }
        pushItem.children.push({
          name: userName,
          userNode: true
        });
      })
      data.children.push(pushItem);
    });
    return data;
  }
}
module.exports = PlatformService;