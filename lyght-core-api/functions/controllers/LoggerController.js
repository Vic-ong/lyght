const Auth = require('@/models/Auth');
const Response = require('./Response');

class Logger {
  constructor(ctx) {
    this.reqBody = ctx.req.body;
  }

  /**
   * Create logs
   */
  async createLogger() {
    const { idToken, params } = this.reqBody;
    const auth = new Auth(idToken);
    const authenticated = await auth.hasReadAccess();

    if (!authenticated) return Response.unauthorized();

    console.log(params);

    return Response.success({
      status: 'success',
    });
  }
}

module.exports = Logger;
