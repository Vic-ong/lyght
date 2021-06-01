const { firestore: db } = require('@/services/firebase');
const { sendEmail } = require('@/services/broadcast/email');
const { snakeToCamel } = require('@/utils/format');
const { timestampToDate } = require('@/utils/date');
const Auth = require('@/models/Auth');
const Order = require('@/models/Order');
const Project = require('@/models/Project');
const orderPlaced = require('./EmailTemplates/templates/orderPlaced');
const orderCancelled = require('./EmailTemplates/templates/orderCancelled');
const Response = require('./Response');

class OrderController {
  constructor(ctx) {
    this.reqBody = ctx.req.body;
  }

  /**
   * Create Order
   * - Verify user's write permission
   * - Ensure that project exists and is active
   * - Ensure quantity ordered is within inventory count
   * - Get unit cost and calculate total amount
   */
  async createOrder() {
    const { idToken, order, userId, projectId, projectGroupId } = this.reqBody;
    const { authenticated } = await Order.verifyWritePermission(idToken, userId);

    if (!authenticated) return Response.unauthorized();

    db.runTransaction(async (transaction) => {
      const projectGroupDoc = await transaction.get(db.collection('project_groups').doc(projectGroupId));
      if (!projectGroupDoc.exists) throw new Error('Invalid project group!');

      const projectDoc = await transaction.get(db.collection('projects').doc(projectId));
      if (!projectDoc.exists) throw new Error('Invalid project!');
      const projectData = snakeToCamel(projectDoc.data());
      if (projectData.status !== 'active') throw new Error('Invalid project!');

      const userDoc = await transaction.get(db.collection('users').doc(userId));
      if (!userDoc.exists) throw new Error('Invalid user!');
      const userData = snakeToCamel(userDoc.data());

      const { panelsTotal, panelsReserved, panelsSold, unitCost } = projectData;
      const panelsAvailable = panelsTotal - panelsReserved - panelsSold;

      let newOrderParams;
      const newOrderBase = {
        item: order.item,
        quantity: order.quantity,
        unitCost,
        total: {
          value: unitCost.value * order.quantity,
          currency: unitCost.currency,
        },
        bankAccountId: order.bankAccountId,
        userId,
        projectId,
        projectGroupId,
      };

      if (order.status === 'unfulfilled' && order.quantity <= panelsAvailable) {
        newOrderParams = {
          ...newOrderBase,
          status: 'unfulfilled',
          statusDates: {
            unfulfilled: new Date(),
          },
        };
      } else if (order.status === 'waitlist' && order.quantity > panelsAvailable) {
        newOrderParams = {
          ...newOrderBase,
          status: 'waitlist',
          statusDates: {
            waitlist: new Date(),
          },
        };
      }

      if (!newOrderParams) throw new Error('Invalid order!');

      // Create order
      const newOrder = new Order(newOrderParams, userData);
      await newOrder.createDoc(transaction);

      // Update project panels count
      const projectUpdate = new Project({
        panelsReservedIncrement: order.quantity,
      });
      await projectUpdate.updateDoc(projectId, transaction);

      // Send confirmation email
      const mailParams = {
        name: userData.firstName,
        order: newOrder,
        project: projectData,
      };
      const mailOptions = {
        to: userData.email,
        from: '"Lyght" <info@lyght.com.tw>',
        subject: `Lyght Order: ${newOrder.orderNumber}`,
        html: orderPlaced(mailParams, userData.language),
      };

      sendEmail(mailOptions);
    });

    return Response.success(this.reqBody);
  }

  /**
   * Cancel Order
   * - Verify user's write permission
   */
  async cancelOrder() {
    const { idToken, id } = this.reqBody;

    const auth = new Auth(idToken);
    const authenticated = await auth.hasWriteAccess();

    if (!authenticated) return Response.unauthorized();

    db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(db.collection('users').doc(auth.claims.uid));
      if (!userDoc.exists) throw new Error('Invalid user!');
      const userData = snakeToCamel(userDoc.data());

      const orderDoc = await transaction.get(db.collection('orders').doc(id));
      if (!orderDoc.exists) throw new Error('Invalid order!');
      const orderData = snakeToCamel(orderDoc.data());

      const projectDoc = await transaction.get(db.collection('projects').doc(orderData.projectId));
      if (!projectDoc.exists) throw new Error('Invalid project!');
      const projectData = snakeToCamel(projectDoc.data());

      // Update order
      const orderUpdateParams = {
        status: 'cancelled',
        statusDates: {
          waitlist: timestampToDate(orderData.statusDates.waitlist),
          unfulfilled: timestampToDate(orderData.statusDates.unfulfilled),
          contractSigned: timestampToDate(orderData.statusDates.contractSigned),
          paid: timestampToDate(orderData.statusDates.paid),
          cancelled: new Date(),
        },
      };
      const orderUpdate = new Order(orderUpdateParams, userData);
      await orderUpdate.updateDoc(id, transaction);

      if (orderData.status !== 'waitlist') {
        // Update project panels count
        const projectUpdate = new Project({
          panelsReservedIncrement: orderData.quantity * -1,
        });
        await projectUpdate.updateDoc(orderData.projectId, transaction);
      }

      // Send cancellation email
      const mailParams = {
        name: userData.firstName,
        order: orderData,
        project: projectData,
      };
      const mailOptions = {
        to: userData.email,
        from: '"Lyght" <info@lyght.com.tw>',
        subject: `Lyght Order: ${orderData.orderNumber}`,
        html: orderCancelled(mailParams, userData.language),
      };

      sendEmail(mailOptions);
    });

    return Response.success(this.reqBody);
  }
}

module.exports = OrderController;
