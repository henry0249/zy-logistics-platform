const Service = require('egg').Service;
const axios = require('axios');

class BaiduMapService extends Service {
  async geocoder() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    let {
      lng,
      lat
    } = body;
    let pois = body.pois || 0;
    let ak = 'tZE1am1BmgwHTyePKMjgrOGdjgskajL8';
    let res = await axios(`http://api.map.baidu.com/geocoder/v2/?location=${lat},${lng}&output=json&pois=${pois}&ak=${ak}&language_auto=1&latest_admin=1`);
    if (res.data.status !== 0) {
      ctx.throw(422, '坐标解析失败', body);
    }
    return res.data.result;
  }
}
module.exports = BaiduMapService;