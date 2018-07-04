const Service = require('egg').Service;

class LogisticsTrajectoryService extends Service {
  async add() {
    const ctx = this.ctx;
    let body = ctx.request.body;
    if (!body.logistics) {
      
    }
    let model = new ctx.model.LogisticsTrajectory({

    });
    return 'ok';
  }
}
module.exports = LogisticsTrajectoryService;