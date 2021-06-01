const parsePhoneNumber = require('libphonenumber-js');
const identityToolkit = require('@/services/google/identityToolkit');
const Auth = require('@/models/Auth');
const User = require('@/models/User');
const Response = require('./Response');

class PhoneAuthController {
  constructor(ctx) {
    this.reqBody = ctx.req.body;
  }

  /**
   * Updates user's phone number and send verification code
   */
  async sendCode() {
    const { idToken, userId, phoneNumber, recaptchaToken } = this.reqBody;

    const auth = new Auth(idToken);
    const authenticated = await auth.hasReadAccess();

    if (!authenticated) return Response.unauthorized();

    const parsedPhoneNumber = parsePhoneNumber(phoneNumber).formatInternational();
    await User.updateUserAuth(userId, { phoneNumber: parsedPhoneNumber });

    const res = await identityToolkit.relyingparty.sendVerificationCode({
      phoneNumber: parsedPhoneNumber,
      recaptchaToken,
    });
    // sessionInfo to verify code
    const { sessionInfo } = res.data;

    return Response.success({
      phoneNumber: parsedPhoneNumber,
      sessionInfo,
    });
  }

  /**
   * Verify the code input by the user
   */
  async verifyCode() {
    const { idToken, code, sessionInfo } = this.reqBody;

    const auth = new Auth(idToken);
    const authenticated = await auth.hasReadAccess();

    if (!authenticated) return Response.unauthorized();

    const res = await identityToolkit.relyingparty.verifyPhoneNumber({
      code,
      sessionInfo,
    });

    return Response.success({
      result: { code, res },
    });
  }
}

module.exports = PhoneAuthController;
