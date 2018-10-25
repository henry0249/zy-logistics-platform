const Service = require('egg').Service;
const axios = require('axios');
const bankcardinfo = require('./bankcardlist');

class LibService extends Service {
  async bankcardinfo() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (ctx.method === 'GET') {
      body = ctx.query;
    }
    if (!body.cardNo) {
      ctx.throw(422, '银行卡卡号必填');
    }
    let data = await axios(`https://ccdcapi.alipay.com/validateAndCacheCardInfo.json?cardNo=${body.cardNo}&cardBinCheck=true`);
    if (!(data.data && data.data.stat === 'ok')) ctx.throw(404, '查询失败');
    let cardTypeMap = {
      DC: "储蓄卡",
      CC: "信用卡",
      SCC: "准贷记卡",
      PC: "预付费卡"
    };
    let res = data.data;
    bankcardinfo.forEach((item)=>{
      if (item.bankCode === res.bank) {
        res.bankName = item.bankName;
      }
    });
    if (cardTypeMap[res.cardType]) {
      res.cardTypeName = cardTypeMap[res.cardType];
    }
    return res;
  }
}
module.exports = LibService;