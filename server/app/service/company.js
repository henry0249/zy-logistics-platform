const Service = require('egg').Service;
const companyField = require('../field/Company');

class CompanyService extends Service {
  // async add(param) {
  //   const ctx = this.ctx;
  //   return {
  //     ...param,
  //     creater: ctx.user._id,
  //     owner: ctx.user._id,
  //   };
  // }
  // async set(param) {
  //   return await this.add(param);
  // }
  async userCascader() {
    const ctx = this.ctx;
    let body = {};
    if (ctx.method === 'GET') {
      body = ctx.request.query;
    } else {
      body = ctx.request.body;
    }
    if (!body.company) {
      ctx.throw(422, '公司_id必填', body);
    }
    let data = [
      // {
      //   name: '主管理员',
      //   key: 'owner'
      // },
      // {
      //   name: '管理员',
      //   key: 'admin',
      // },
      {
        name: '业务专员',
        key: 'salesman'
      },
      {
        name: '单据文员',
        key: 'documentClerk'
      },
      {
        name: '财务文员',
        key: 'financial'
      }
    ];
    let company = await ctx.model.Company.findById(body.company);
    if (!company) {
      ctx.throw(404, '公司信息不存在', body);
    }
    let res = [];
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let $in = [];
      if (company[item.key] instanceof Array) {
        $in = company[item.key];
      } else {
        $in = [company[item.key]]
      }
      item.children = await ctx.model.User.find({
        _id: {
          $in: $in
        }
      });
      if (item.children.length > 0) {
        res.push(item);
      }
    }
    return res;
  }
  async truckAndShipCascader() {
    const ctx = this.ctx;
    let res = [];
    let body = {};
    if (ctx.method === 'GET') {
      body = ctx.request.query;
    } else {
      body = ctx.request.body;
    }
    let companyType = ['logistics'];
    if (body.type instanceof Array && body.type.length > 0) {
      companyType = body.type;
    } else {
      if (companyField.type[body.type]) {
        companyType = [body.type];
      }
    }

    let companys = await ctx.model.Company.find({
      type: {
        $in: companyType
      }
    });
    for (let i = 0; i < companys.length; i++) {
      let companyItem = JSON.parse(JSON.stringify(companys[i]));
      companyItem.no = companyItem.name;
      let trucks = await ctx.model.Truck.find({
        company: companyItem._id
      });
      if (trucks.length > 0) {
        companyItem.children = [{
          no: '车',
          _id: 'truck',
          children: trucks
        }];
      }
      let ships = await ctx.model.Ship.find({
        company: companyItem._id
      });
      if (ships.length > 0) {
        if (companyItem.children.length > 0) {
          companyItem.children.push({
            no: '船',
            _id: 'ship',
            children: ships
          });
        } else {
          companyItem.children = [{
            no: '船',
            _id: 'ship',
            children: ships
          }];
        }

      }
      if (companyItem.children) {
        res.push(companyItem);
      }
    }
    return res;
  }
}
module.exports = CompanyService;