const { firestore } = require('@/services/firebase');
const BaseModel = require('@/models/BaseModel');
const Auth = require('@/models/Auth');
const Currency = require('@/models/Currency');
const { camelToSnake } = require('@/utils/format');
const { compressObject } = require('./utils');

const collectionRef = firestore.collection('orders');

const generateOrderNumber = () => {
  const id = new Date().getTime().toString(36);
  return id.toUpperCase();
};

class Order extends BaseModel {
  constructor(data = {}, user = {}) {
    super(user);

    this.orderNumber = data.orderNumber || generateOrderNumber();
    this.item = data.item;
    this.quantity = Number(data.quantity);
    this.projectId = data.projectId;
    this.projectGroupId = data.projectGroupId;
    this.userId = data.userId;
    this.bankAccountId = data.bankAccountId;
    this.unitCost = data.unitCost ? new Currency(data.unitCost) : undefined;
    this.total = data.total ? new Currency(data.total) : undefined;
    this.status = data.status;
    this.statusDates = data.statusDates
      ? {
          waitlist: data.statusDates.waitlist || null,
          unfulfilled: data.statusDates.unfulfilled || null,
          contractSigned: data.statusDates.contractSigned || null,
          paid: data.statusDates.paid || null,
          cancelled: data.statusDates.cancelled || null,
        }
      : undefined;
  }

  static async verifyWritePermission(idToken, userId) {
    const auth = new Auth(idToken);
    const hasWriteAccess = await auth.hasWriteAccess();
    const isContentOwner = userId === auth.claims.uid || auth.isAdmin;
    return {
      authenticated: hasWriteAccess && isContentOwner,
      claims: auth.claims,
    };
  }

  createDoc(process) {
    const payload = {
      ...this.toJson(),
      ...this.getCreatedTime(),
      ...this.getUpdatedTime(),
    };
    if (process) {
      return process.set(collectionRef.doc(), payload);
    }
    return collectionRef.add(payload);
  }

  updateDoc(id, process) {
    const payload = {
      ...this.toJson(),
      ...this.getUpdatedTime(),
    };
    if (process) {
      return process.update(collectionRef.doc(id), payload);
    }
    return collectionRef.doc(id).update(payload);
  }

  toJson() {
    const obj = {
      order_number: this.orderNumber,
      item: this.item,
      quantity: this.quantity,
      project_id: this.projectId,
      project_group_id: this.projectGroupId,
      user_id: this.userId,
      bank_account_id: this.bankAccountId,
      status: this.status,
    };
    if (this.unitCost) obj.unit_cost = this.unitCost.toJson();
    if (this.total) obj.total = this.total.toJson();
    if (this.statusDates) obj.status_dates = camelToSnake(this.statusDates);

    compressObject(obj);
    return obj;
  }
}

module.exports = Order;
