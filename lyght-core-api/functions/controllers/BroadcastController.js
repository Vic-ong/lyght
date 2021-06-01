const Auth = require('@/models/Auth');
const { sendEmail } = require('@/services/broadcast/email');
const accountApprovedTemplate = require('./EmailTemplates/templates/accountApprovedTemplate');
const orderPaid = require('./EmailTemplates/templates/orderPaid');
const orderCancelled = require('./EmailTemplates/templates/orderCancelled');
const Response = require('./Response');

class BroadcastController {
  constructor(ctx) {
    this.reqBody = ctx.req.body;
  }

  async notifyAccountApproved() {
    const { idToken, to, lang = 'en', params } = this.reqBody;
    const auth = new Auth(idToken);
    const authenticated = await auth.hasAdminClaims();

    if (!authenticated) return Response.unauthorized();

    const mailOptions = {
      to,
      from: '"Lyght" <info@lyght.com.tw>',
      subject: 'Lyght Account Verification',
      html: accountApprovedTemplate(params, lang),
    };

    const info = await sendEmail(mailOptions);

    return Response.success({
      messageId: info.messageId,
    });
  }

  async notifyOrderPaid() {
    const { idToken, to, lang = 'en', params } = this.reqBody;
    const auth = new Auth(idToken);
    const authenticated = await auth.hasAdminClaims();

    if (!authenticated) return Response.unauthorized();

    const mailOptions = {
      to,
      from: '"Lyght" <info@lyght.com.tw>',
      subject: `Lyght Project Participated: ${params.project.name}`,
      html: orderPaid(params, lang),
    };

    const info = await sendEmail(mailOptions);

    return Response.success({
      messageId: info.messageId,
    });
  }

  async notifyOrderCancelled() {
    const { idToken, to, lang = 'en', params } = this.reqBody;
    const auth = new Auth(idToken);
    const authenticated = await auth.hasAdminClaims();

    if (!authenticated) return Response.unauthorized();

    const mailOptions = {
      to,
      from: '"Lyght" <info@lyght.com.tw>',
      subject: `Order Cancelled: ${params.order.orderNumber}`,
      html: orderCancelled(params, lang),
    };

    const info = await sendEmail(mailOptions);

    return Response.success({
      messageId: info.messageId,
    });
  }
}

module.exports = BroadcastController;
