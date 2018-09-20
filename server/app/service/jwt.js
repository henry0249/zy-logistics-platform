const Service = require('egg').Service;

class jwtService extends Service {
  async sign(user, option = {}) {
    const ctx = this.ctx;
    let token = await ctx.helper.jwtSign(user, option);
    let uaObj = ctx.helper.ua();
    let tokenData = await ctx.model.Jwt.findOne({
      user: user._id
    });
    if (tokenData) {
      let update = {
        ...token,
        $addToSet: {
          ualist: uaObj
        },
        ua: uaObj,
        loginAt: new Date(),
        lastAccessAt: new Date(),
        ...option
      };
      await tokenData.update(update);
    } else {
      let newTokenData = new ctx.model.Jwt({
        ...token,
        user: user._id,
        ua: uaObj,
        loginAt: new Date(),
        lastAccessAt: new Date(),
        ...option
      })
      await newTokenData.save();
      await newTokenData.update({
        $addToSet: {
          ualist: uaObj
        }
      });
    }
    return token;
  }
  async verify() {
    const ctx = this.ctx;
    let {
      header,
      body,
    } = ctx.request;
    let token = header.authorization || body.token;
    await ctx.helper.jwtVerify(token);
    let tokenData = await ctx.model.Jwt.findOne({
      value: token
    }).populate([{
      path: 'user'
    }, {
      path: 'company',
    }]);
    if (!tokenData) {
      ctx.throw(401, '登录已失效,请尝试重新登录');
    }
    let lastAccessAt = tokenData.lastAccessAt ? new Date(tokenData.lastAccessAt).getTime() : new Date().getTime();
    let expAt = new Date(tokenData.expAt).getTime();
    let now = new Date().getTime();
    if ((now - lastAccessAt) > this.config.tokenExp) {
      ctx.throw(401, '登录已超时,请尝试重新登录');
    }
    if ((expAt - lastAccessAt) <= this.config.tokenExp) {
      let refleshtoken = await this.sign(tokenData.user);
      ctx.set('refleshtoken', refleshtoken.value);
      return await ctx.model.Jwt.findOne({
        value: refleshtoken.value
      }).populate([{
        path: 'user'
      }, {
        path: 'company',
      }]);
    }
    await tokenData.update({
      lastAccessAt: new Date()
    });
    return tokenData;
  }
}
module.exports = jwtService;