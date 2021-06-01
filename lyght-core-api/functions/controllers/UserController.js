const Auth = require('@/models/Auth');
const User = require('@/models/User');
const Response = require('./Response');

class UserController {
  constructor(ctx) {
    this.reqBody = ctx.req.body;
  }
  /**
   * Create an access record for a user
   */
  async createAuth() {
    const { idToken, _id, email } = this.reqBody;
    const customClaims = { email };

    const auth = new Auth(idToken);
    const hasWriteAccess = await auth.hasWriteAccess();
    const isContentOwner = _id === auth.claims.uid || auth.isAdmin;
    const authenticated = hasWriteAccess && isContentOwner;

    if (!authenticated) return Response.unauthorized();

    await User.createAccess(_id, customClaims);

    return Response.success({ _id });
  }
}

module.exports = UserController;
